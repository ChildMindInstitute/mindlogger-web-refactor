import { clearStaleSession } from './clearStaleSession';

import { userModel } from '~/entities/user';
import { authorizationService } from '~/shared/api';
import { setLastActivityAt } from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';

vi.mock('~/shared/utils/storage/secureTokensStorage', () => ({
  secureTokensStorage: { getTokens: vi.fn(), setTokens: vi.fn(), clearTokens: vi.fn() },
}));

vi.mock('~/entities/user', () => ({
  userModel: { secureUserPrivateKeyStorage: { clearUserPrivateKey: vi.fn() } },
}));

vi.mock('~/shared/api', () => ({ authorizationService: { logout: vi.fn() } }));

const clearUserPrivateKey = vi.mocked(userModel.secureUserPrivateKeyStorage.clearUserPrivateKey);
const clearTokens = vi.mocked(secureTokensStorage.clearTokens);
const getTokens = vi.mocked(secureTokensStorage.getTokens);
const logout = vi.mocked(authorizationService.logout);

const MIN = 60000;
const START = 1893456000000;

const tokenExpiringAt = (at: number) =>
  `header.${btoa(JSON.stringify({ exp: Math.floor(at / 1000) }))}.signature`;

// What the store holds for a session whose refresh token the server would still accept.
const heldTokens = (refreshTokenExpiresAt: number) => ({
  accessToken: 'access-1',
  refreshToken: tokenExpiringAt(refreshTokenExpiresAt),
  tokenType: 'Bearer',
});

describe('clearStaleSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(START);
    vi.stubEnv('VITE_IDLE_TIMEOUT_MIN', '10');
    logout.mockResolvedValue({} as never);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  const persist = (slices: Record<string, unknown>) =>
    localStorage.setItem(
      'persist:root',
      JSON.stringify(
        Object.fromEntries(Object.entries(slices).map(([k, v]) => [k, JSON.stringify(v)])),
      ),
    );

  const persisted = () => JSON.parse(localStorage.getItem('persist:root') ?? '{}') as object;

  it('ends a session that sat past its deadline while the browser was closed', async () => {
    setLastActivityAt(START - 11 * MIN);

    await clearStaleSession();

    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(clearUserPrivateKey).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('lastActivityAt')).toBeNull();
  });

  it('drops the same persisted state a logout drops, so nothing is left for the next person', async () => {
    setLastActivityAt(START - 11 * MIN);
    persist({
      user: { id: 'user-1', email: 'jane@example.com' },
      applets: { progress: { 'activity-1': 'half done' } },
      autoCompletion: { 'activity-1': {} },
      defaultBanners: { dismissedBanners: { welcome: true } },
      _persist: { version: -1, rehydrated: true },
    });

    await clearStaleSession();

    // defaultBanners survives a logout today, so it survives here too.
    expect(persisted()).toEqual({
      defaultBanners: JSON.stringify({ dismissedBanners: { welcome: true } }),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    });
  });

  it('leaves persisted state alone while the session is still live', async () => {
    setLastActivityAt(START - 9 * MIN);
    persist({ user: { id: 'user-1' } });

    await clearStaleSession();

    expect(persisted()).toEqual({ user: JSON.stringify({ id: 'user-1' }) });
  });

  it('leaves a session that is still inside its deadline', async () => {
    setLastActivityAt(START - 9 * MIN);

    await clearStaleSession();

    expect(clearTokens).not.toHaveBeenCalled();
    expect(localStorage.getItem('lastActivityAt')).toBe(String(START - 9 * MIN));
  });

  it('leaves a session with no clock alone, since there is no deadline to judge it against', async () => {
    await clearStaleSession();

    expect(clearTokens).not.toHaveBeenCalled();
    expect(clearUserPrivateKey).not.toHaveBeenCalled();
  });

  // Clearing here only ends the session in this browser. The server would go on accepting the
  // token until it expires on its own.
  it('revokes on the server while the token would still be accepted', async () => {
    setLastActivityAt(START - 11 * MIN);
    getTokens.mockReturnValue(heldTokens(START + 5 * MIN));

    await clearStaleSession();

    expect(logout).toHaveBeenCalledWith({ accessToken: 'access-1' });
  });

  it('asks first, while the tokens the call needs are still there', async () => {
    setLastActivityAt(START - 11 * MIN);
    getTokens.mockReturnValue(heldTokens(START + 5 * MIN));
    logout.mockImplementation(() => {
      expect(clearTokens).not.toHaveBeenCalled();

      return Promise.resolve({} as never);
    });

    await clearStaleSession();

    expect(logout).toHaveBeenCalled();
  });

  it('spends no call on a token the server would turn away anyway', async () => {
    setLastActivityAt(START - 11 * MIN);
    getTokens.mockReturnValue(heldTokens(START - MIN));

    await clearStaleSession();

    expect(logout).not.toHaveBeenCalled();
    expect(clearTokens).toHaveBeenCalledTimes(1);
  });

  // The session is over here either way, so a server that cannot be reached must not strand it.
  it('ends the session locally even when the server cannot be told', async () => {
    setLastActivityAt(START - 11 * MIN);
    getTokens.mockReturnValue(heldTokens(START + 5 * MIN));
    logout.mockRejectedValue(new Error('network'));

    await clearStaleSession();

    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('lastActivityAt')).toBeNull();
  });
});
