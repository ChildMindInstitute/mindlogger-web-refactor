import { renderHook } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { useSessionKeepAlive } from './useSessionKeepAlive';

import { refreshTokens } from '~/shared/api/services/axios';
import { setLastActivityAt } from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';

const mockLogout = vi.fn();

vi.mock('~/features/Logout', () => ({
  useLogout: () => ({ logout: mockLogout, isLoading: false }),
}));

vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: vi.fn() }));

vi.mock('~/shared/api/services/axios', () => ({ default: {}, refreshTokens: vi.fn() }));

vi.mock('~/shared/utils/storage/secureTokensStorage', () => ({
  secureTokensStorage: { getTokens: vi.fn(), setTokens: vi.fn(), clearTokens: vi.fn() },
}));

const MIN = 60000;
const START = 1893456000000;

const tokenExpiringAt = (at: number) => {
  const payload = window
    .btoa(JSON.stringify({ exp: Math.floor(at / 1000) }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `header.${payload}.signature`;
};

const setAccessTokenExpiringAt = (at: number) =>
  vi.mocked(secureTokensStorage.getTokens).mockReturnValue({
    accessToken: tokenExpiringAt(at),
    refreshToken: 'refresh-1',
    tokenType: 'Bearer',
  });

const enableRefresh = (enabled: boolean) =>
  vi.mocked(useFlags).mockReturnValue({ enableSessionKeepAlive: enabled });

describe('useSessionKeepAlive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(START);
    // Pinned here rather than inherited from .env, which vitest also loads.
    vi.stubEnv('VITE_IDLE_TIMEOUT_MIN', '10');
    vi.stubEnv('VITE_REFRESH_LEAD_SEC', '60');
    enableRefresh(false);
    setAccessTokenExpiringAt(START + 60 * MIN);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('ends a session whose deadline already passed before this tab looked', () => {
    setLastActivityAt(START - 11 * MIN);

    renderHook(() => useSessionKeepAlive());

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('leaves the session alone while another tab keeps the shared clock moving', async () => {
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    // Another tab is in use and writes the clock this tab is reading.
    await vi.advanceTimersByTimeAsync(5 * MIN);
    setLastActivityAt(START + 5 * MIN);

    // Past this tab's own deadline. It re-reads instead of logging out.
    await vi.advanceTimersByTimeAsync(5 * MIN);
    expect(mockLogout).not.toHaveBeenCalled();

    // Nothing has touched the clock since, so the extended deadline does end it.
    await vi.advanceTimersByTimeAsync(5 * MIN);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('pushes the deadline out when this tab sees activity', async () => {
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    await vi.advanceTimersByTimeAsync(9 * MIN);
    window.dispatchEvent(new Event('keydown'));

    await vi.advanceTimersByTimeAsync(2 * MIN);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('re-checks the deadline on return rather than trusting a parked timer', async () => {
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    // Stands in for a suspended tab: the clock moved on, its timer never fired.
    setLastActivityAt(START - 11 * MIN);
    document.dispatchEvent(new Event('visibilitychange'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('refreshes ahead of expiry once the flag is on', async () => {
    enableRefresh(true);
    setLastActivityAt(START);
    setAccessTokenExpiringAt(START + 5 * MIN);

    renderHook(() => useSessionKeepAlive());

    await vi.advanceTimersByTimeAsync(4 * MIN - 1000);
    expect(refreshTokens).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2000);
    expect(refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('waits out a token shorter-lived than the lead instead of refreshing on every tick', async () => {
    enableRefresh(true);
    setLastActivityAt(START);
    setAccessTokenExpiringAt(START + 30000);
    // A real refresh hands back a long-lived token; the mock has to as well, or the retry that
    // follows would look like the storm this cap exists to prevent.
    vi.mocked(refreshTokens).mockImplementation(() => {
      setAccessTokenExpiringAt(START + 60 * MIN);

      return Promise.resolve({ accessToken: 'a', refreshToken: 'r', tokenType: 'Bearer' });
    });

    renderHook(() => useSessionKeepAlive());

    // Uncapped, a 60s lead against 30s of life puts the deadline in the past and fires at once.
    await vi.advanceTimersByTimeAsync(1000);
    expect(refreshTokens).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(15000);
    expect(refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('does not refresh while the flag is off', async () => {
    setLastActivityAt(START);
    setAccessTokenExpiringAt(START + 5 * MIN);

    renderHook(() => useSessionKeepAlive());

    await vi.advanceTimersByTimeAsync(9 * MIN);
    expect(refreshTokens).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('ends the session when the refresh it was counting on fails', async () => {
    enableRefresh(true);
    vi.mocked(refreshTokens).mockRejectedValue(new Error('revoked'));
    setLastActivityAt(START);
    setAccessTokenExpiringAt(START + 5 * MIN);

    renderHook(() => useSessionKeepAlive());

    await vi.advanceTimersByTimeAsync(5 * MIN);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('stops its timers once the route unmounts', async () => {
    setLastActivityAt(START);
    const { unmount } = renderHook(() => useSessionKeepAlive());

    unmount();

    await vi.advanceTimersByTimeAsync(20 * MIN);
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
