import { act, fireEvent, render, screen } from '@testing-library/react';

import { SessionKeepAlive } from './SessionKeepAlive';

import {
  clearSessionState,
  closeSessionSync,
  COUNTDOWN_TICK_MS,
  getLastActivityAt,
  setLastActivityAt,
} from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';
import { InMemoryBroadcastChannel, resetInMemoryBroadcastChannels } from '~/test/utils';

const mockLogout = vi.fn();

vi.mock('~/features/Logout', () => ({
  useLogout: () => ({ logout: mockLogout, isLoading: false }),
}));

vi.mock('~/shared/api/services/axios', () => ({ default: {}, refreshTokens: vi.fn() }));

vi.mock('~/shared/utils/storage/secureTokensStorage', () => ({
  secureTokensStorage: { getTokens: vi.fn(), setTokens: vi.fn(), clearTokens: vi.fn() },
}));

// i18next is not initialised under vitest, so keys render bare. Interpolation is kept visible so
// the countdown reaching the copy can still be asserted.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) =>
      options?.countdown ? `${key} ${options.countdown}` : key,
    i18n: { language: 'en' },
  }),
}));

const MIN = 60000;
const START = 1893456000000;
const IDLE_MS = 10 * MIN;
const WARNING_MS = 1 * MIN;

const tokenExpiringAt = (at: number) =>
  `header.${window.btoa(JSON.stringify({ exp: Math.floor(at / 1000) }))}.signature`;

const warning = () => screen.queryByTestId('session-timeout-modal');

// Long enough for the warning to be due, but not for the session to have ended.
const idleUntilTheWarning = () => vi.advanceTimersByTimeAsync(IDLE_MS - WARNING_MS);

describe('SessionKeepAlive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(START);
    vi.stubEnv('VITE_IDLE_TIMEOUT_MIN', '10');
    vi.stubEnv('VITE_REFRESH_LEAD_SEC', '60');
    vi.stubEnv('VITE_IDLE_WARNING_MIN', '1');
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    vi.mocked(secureTokensStorage.getTokens).mockReturnValue({
      accessToken: tokenExpiringAt(START + 60 * MIN),
      refreshToken: `header.${window.btoa(JSON.stringify({ family: 'family-1' }))}.signature`,
      tokenType: 'Bearer',
    });
    setLastActivityAt(START);
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    clearSessionState();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('shows nothing while the deadline is far off', () => {
    render(<SessionKeepAlive />);

    expect(warning()).not.toBeInTheDocument();
  });

  it('shows the countdown once the warning is due', async () => {
    render(<SessionKeepAlive />);

    await idleUntilTheWarning();

    expect(warning()).toBeInTheDocument();
    expect(screen.getByText('description 1:00')).toBeInTheDocument();
  });

  it('redraws the countdown every second', async () => {
    render(<SessionKeepAlive />);

    await idleUntilTheWarning();
    await vi.advanceTimersByTimeAsync(3 * COUNTDOWN_TICK_MS);

    expect(screen.getByText('description 0:57')).toBeInTheDocument();
  });

  it('staying logged in dismisses it and keeps the session', async () => {
    render(<SessionKeepAlive />);

    await idleUntilTheWarning();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'stayLoggedIn' }));
    });

    expect(warning()).not.toBeInTheDocument();
    expect(getLastActivityAt()).toBe(Date.now());
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('logging out from the warning ends the session deliberately', async () => {
    render(<SessionKeepAlive />);

    await idleUntilTheWarning();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'logOut' }));
    });

    expect(mockLogout).toHaveBeenCalledWith({ reason: 'manual' });
  });

  it('an unanswered countdown runs out into an idle logout', async () => {
    render(<SessionKeepAlive />);

    await vi.advanceTimersByTimeAsync(IDLE_MS);

    expect(warning()).not.toBeInTheDocument();
    expect(mockLogout).toHaveBeenCalledWith({ reason: 'idle' });
  });
});
