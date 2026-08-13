import { clearStaleSession } from './clearStaleSession';

import { userModel } from '~/entities/user';
import { setLastActivityAt } from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';

vi.mock('~/shared/utils/storage/secureTokensStorage', () => ({
  secureTokensStorage: { getTokens: vi.fn(), setTokens: vi.fn(), clearTokens: vi.fn() },
}));

vi.mock('~/entities/user', () => ({
  userModel: { secureUserPrivateKeyStorage: { clearUserPrivateKey: vi.fn() } },
}));

const clearUserPrivateKey = vi.mocked(userModel.secureUserPrivateKeyStorage.clearUserPrivateKey);
const clearTokens = vi.mocked(secureTokensStorage.clearTokens);

const MIN = 60000;
const START = 1893456000000;

describe('clearStaleSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(START);
    vi.stubEnv('VITE_IDLE_TIMEOUT_MIN', '10');
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

  it('ends a session that sat past its deadline while the browser was closed', () => {
    setLastActivityAt(START - 11 * MIN);

    clearStaleSession();

    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(clearUserPrivateKey).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('lastActivityAt')).toBeNull();
  });

  it('drops the same persisted state a logout drops, so nothing is left for the next person', () => {
    setLastActivityAt(START - 11 * MIN);
    persist({
      user: { id: 'user-1', email: 'jane@example.com' },
      applets: { progress: { 'activity-1': 'half done' } },
      autoCompletion: { 'activity-1': {} },
      defaultBanners: { dismissedBanners: { welcome: true } },
      _persist: { version: -1, rehydrated: true },
    });

    clearStaleSession();

    // defaultBanners survives a logout today, so it survives here too.
    expect(persisted()).toEqual({
      defaultBanners: JSON.stringify({ dismissedBanners: { welcome: true } }),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    });
  });

  it('leaves persisted state alone while the session is still live', () => {
    setLastActivityAt(START - 9 * MIN);
    persist({ user: { id: 'user-1' } });

    clearStaleSession();

    expect(persisted()).toEqual({ user: JSON.stringify({ id: 'user-1' }) });
  });

  it('leaves a session that is still inside its deadline', () => {
    setLastActivityAt(START - 9 * MIN);

    clearStaleSession();

    expect(clearTokens).not.toHaveBeenCalled();
    expect(localStorage.getItem('lastActivityAt')).toBe(String(START - 9 * MIN));
  });

  it('leaves a session with no clock alone, since there is no deadline to judge it against', () => {
    clearStaleSession();

    expect(clearTokens).not.toHaveBeenCalled();
    expect(clearUserPrivateKey).not.toHaveBeenCalled();
  });
});
