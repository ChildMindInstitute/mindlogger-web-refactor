import { renderHook } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { useSessionKeepAlive } from './useSessionKeepAlive';

import { refreshTokens } from '~/shared/api/services/axios';
import {
  closeSessionSync,
  SESSION_CHANNEL_NAME,
  SESSION_REQUEST_WINDOW_MS,
  SessionMessage,
  setLastActivityAt,
} from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';
import { InMemoryBroadcastChannel, resetInMemoryBroadcastChannels } from '~/test/utils';

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

const SESSION_ID = 'family-1';

const refreshTokenFor = (sessionId: string) =>
  `header.${window.btoa(JSON.stringify({ family: sessionId }))}.signature`;

const setAccessTokenExpiringAt = (at: number) =>
  vi.mocked(secureTokensStorage.getTokens).mockReturnValue({
    accessToken: tokenExpiringAt(at),
    refreshToken: refreshTokenFor(SESSION_ID),
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
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
  });

  const openSiblingTab = () => new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);

  const rotationOf = (accessToken: string, sessionId = SESSION_ID) => ({
    type: 'TOKENS_UPDATED',
    payload: { sessionId, accessToken, refreshToken: refreshTokenFor(sessionId) },
  });

  // A sibling tab still in use, answering every request with the token it holds.
  const answerRequestsWith = (accessToken: string) => {
    const sibling = openSiblingTab();
    sibling.onmessage = ({ data }) => {
      if ((data as SessionMessage).type !== 'SESSION_REQUEST') return;

      sibling.postMessage({
        type: 'SESSION_STATE',
        payload: { sessionId: SESSION_ID, accessToken, refreshToken: refreshTokenFor(SESSION_ID) },
      });
    };
  };

  const wake = () => document.dispatchEvent(new Event('visibilitychange'));

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

  it('starts a fresh deadline for a session signed in after the last one ended', async () => {
    // What a logout leaves behind: no clock. The previous session's deadline must not carry over,
    // or signing back in ends immediately and takes the first request down with it.
    localStorage.removeItem('lastActivityAt');

    renderHook(() => useSessionKeepAlive());

    expect(mockLogout).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(9 * MIN);
    expect(mockLogout).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2 * MIN);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('adopts tokens a sibling rotated and re-arms from them', async () => {
    enableRefresh(true);
    setLastActivityAt(START);
    setAccessTokenExpiringAt(START + 5 * MIN);
    // The re-arm reads the token back out of storage, so the store has to move with the adoption.
    vi.mocked(secureTokensStorage.setTokens).mockImplementation((pair) =>
      vi.mocked(secureTokensStorage.getTokens).mockReturnValue(pair),
    );
    renderHook(() => useSessionKeepAlive());

    const rotated = tokenExpiringAt(START + 60 * MIN);
    openSiblingTab().postMessage(rotationOf(rotated));

    expect(secureTokensStorage.setTokens).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: rotated, tokenType: 'Bearer' }),
    );

    // The replaced token's refresh moment passes without this tab rotating a second time.
    await vi.advanceTimersByTimeAsync(5 * MIN);
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it('ignores tokens rotated in another account session', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    openSiblingTab().postMessage(rotationOf('their-access', 'family-2'));

    expect(secureTokensStorage.setTokens).not.toHaveBeenCalled();
  });

  it('does not rebroadcast the tokens it adopted', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    sibling.postMessage(rotationOf(tokenExpiringAt(START + 60 * MIN)));

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  it('announces itself on start, so a tab still on the login page hears it', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    renderHook(() => useSessionKeepAlive());

    expect(onSiblingMessage).toHaveBeenCalledWith({
      data: {
        type: 'SESSION_STATE',
        payload: {
          sessionId: SESSION_ID,
          accessToken: tokenExpiringAt(START + 60 * MIN),
          refreshToken: refreshTokenFor(SESSION_ID),
        },
      },
    });
  });

  it('answers a session request with the tokens it holds', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    sibling.postMessage({ type: 'SESSION_REQUEST' });

    expect(onSiblingMessage).toHaveBeenCalledWith({
      data: {
        type: 'SESSION_STATE',
        payload: {
          sessionId: SESSION_ID,
          accessToken: tokenExpiringAt(START + 60 * MIN),
          refreshToken: refreshTokenFor(SESSION_ID),
        },
      },
    });
  });

  it('stays silent when its token carries no session id, leaving sync inert', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    vi.mocked(secureTokensStorage.getTokens).mockReturnValue({
      accessToken: tokenExpiringAt(START + 60 * MIN),
      refreshToken: 'opaque-token',
      tokenType: 'Bearer',
    });
    renderHook(() => useSessionKeepAlive());
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    sibling.postMessage({ type: 'SESSION_REQUEST' });

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  it('asks on start whether its tokens were replaced while it was away', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    renderHook(() => useSessionKeepAlive());

    expect(onSiblingMessage).toHaveBeenCalledWith({ data: { type: 'SESSION_REQUEST' } });
  });

  it('adopts a sibling fresher tokens on wake instead of spending its own', async () => {
    enableRefresh(true);
    setLastActivityAt(START);
    vi.mocked(secureTokensStorage.setTokens).mockImplementation((pair) =>
      vi.mocked(secureTokensStorage.getTokens).mockReturnValue(pair),
    );
    renderHook(() => useSessionKeepAlive());

    const rotated = tokenExpiringAt(START + 120 * MIN);
    answerRequestsWith(rotated);
    // The tab slept: the token it still holds was replaced long ago.
    setAccessTokenExpiringAt(START - MIN);
    vi.mocked(refreshTokens).mockClear();

    wake();

    expect(secureTokensStorage.setTokens).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: rotated }),
    );

    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it('keeps its own tokens when a sibling offers no newer generation', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    answerRequestsWith(tokenExpiringAt(START + 5 * MIN));
    wake();

    expect(secureTokensStorage.setTokens).not.toHaveBeenCalled();
  });

  it('ignores a session offered by another account', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    openSiblingTab().postMessage({
      type: 'SESSION_STATE',
      payload: {
        sessionId: 'family-2',
        accessToken: tokenExpiringAt(START + 120 * MIN),
        refreshToken: refreshTokenFor('family-2'),
      },
    });

    expect(secureTokensStorage.setTokens).not.toHaveBeenCalled();
  });

  it('holds the deadline check back on wake, so a handover can beat a zero-delay refresh', async () => {
    enableRefresh(true);
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    // The shared clock ran out while this tab was asleep.
    setLastActivityAt(START - 11 * MIN);
    wake();
    expect(mockLogout).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('tears down when a sibling ends the session, without revoking it again', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    openSiblingTab().postMessage({
      type: 'LOGOUT',
      payload: { sessionId: SESSION_ID, reason: 'manual' },
    });

    expect(mockLogout).toHaveBeenCalledWith({ isRemote: true });
  });

  it('stays signed in when another account session ends', () => {
    enableRefresh(true);
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    openSiblingTab().postMessage({
      type: 'LOGOUT',
      payload: { sessionId: 'family-2', reason: 'manual' },
    });

    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('does not listen for a sibling rotation while the flag is off', () => {
    setLastActivityAt(START);
    renderHook(() => useSessionKeepAlive());

    openSiblingTab().postMessage(rotationOf(tokenExpiringAt(START + 60 * MIN)));

    expect(secureTokensStorage.setTokens).not.toHaveBeenCalled();
  });

  it('stops its timers once the route unmounts', async () => {
    setLastActivityAt(START);
    const { unmount } = renderHook(() => useSessionKeepAlive());

    unmount();

    await vi.advanceTimersByTimeAsync(20 * MIN);
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
