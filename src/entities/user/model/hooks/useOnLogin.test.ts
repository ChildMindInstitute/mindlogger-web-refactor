import { act, renderHook } from '@testing-library/react';

import { useOnLogin } from './useOnLogin';

import {
  clearSessionEnded,
  consumeSessionEnded,
  getLastActivityAt,
  MS_IN_MIN,
  SESSION_ENDED_KEY,
  setLastActivityAt,
  setSessionReturn,
} from '~/shared/utils';

const navigate = vi.fn();
const setUser = vi.fn();
const START = 1893456000000;

vi.mock('./useUserState', () => ({ useUserState: () => ({ setUser }) }));

vi.mock('../secureUserPrivateKeyStorage', () => ({
  secureUserPrivateKeyStorage: { setUserPrivateKey: vi.fn() },
}));

vi.mock('~/shared/utils/featureFlags', () => ({ FeatureFlags: { login: vi.fn() } }));

vi.mock('~/shared/utils', async () => {
  const actual = await vi.importActual<typeof import('~/shared/utils')>('~/shared/utils');

  return {
    ...actual,
    secureTokensStorage: { setTokens: vi.fn(), getTokens: vi.fn(), clearTokens: vi.fn() },
    useCustomNavigation: () => ({ navigate }),
    useEncryption: () => ({ generateUserPrivateKey: () => 'private-key' }),
    Mixpanel: { track: vi.fn(), login: vi.fn() },
  };
});

const signIn = (params: Parameters<typeof useOnLogin>[0] = {}) => {
  const { result } = renderHook(() => useOnLogin(params));

  act(() => {
    result.current.onLoginSuccess({
      user: { id: 'user-2', email: 'b@example.com', firstName: 'B', lastName: 'B' },
      tokens: { accessToken: 'access', refreshToken: 'refresh', tokenType: 'Bearer' },
    });
  });
};

describe('useOnLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
    clearSessionEnded();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // A tab sent to the login page by leaveEndedSession still carries the note. Left set, it turns
  // this sign-in away too, and the user lands back on the login page holding a live session.
  it('answers the note left by the session that ended', () => {
    sessionStorage.setItem(SESSION_ENDED_KEY, 'true');
    consumeSessionEnded();

    signIn();

    expect(sessionStorage.getItem(SESSION_ENDED_KEY)).toBeNull();
    expect(consumeSessionEnded()).toBe(false);
  });

  // A backgrounded tab can miss its idle logout, leaving its clock behind. Read by the new session,
  // it ended the sign-in as soon as it landed.
  it('starts a fresh clock over one left by a session that never logged out', () => {
    vi.useFakeTimers();
    vi.setSystemTime(START);
    setLastActivityAt(START - 60 * MS_IN_MIN);

    signIn();

    expect(getLastActivityAt()).toBe(START);
  });

  it('signs the user in as usual', () => {
    signIn();

    expect(setUser).toHaveBeenCalledWith({
      id: 'user-2',
      email: 'b@example.com',
      firstName: 'B',
      lastName: 'B',
    });
    expect(navigate).toHaveBeenCalled();
  });

  it('starts at the applet list when nothing was left behind', () => {
    signIn();

    expect(navigate).toHaveBeenCalledWith('/protected/applets');
  });

  // What a session ending on its own is meant to feel like: the page is still there afterwards.
  it('resumes the page the last session was ended on', () => {
    setSessionReturn({ path: '/protected/profile', userId: 'user-2', email: 'b@example.com' });

    signIn();

    expect(navigate).toHaveBeenCalledWith('/protected/profile', { replace: true });
  });

  it('leaves that page alone for anybody but the user it belonged to', () => {
    setSessionReturn({ path: '/protected/profile', userId: 'user-1', email: 'a@example.com' });

    signIn();

    expect(navigate).toHaveBeenCalledWith('/protected/applets');
  });

  // The link is the more recent ask: it is why the user opened the app at all, while the recorded
  // page is only where they happened to be standing when the session ran out.
  it('follows the link the user came in on ahead of the page they left', () => {
    setSessionReturn({ path: '/protected/profile', userId: 'user-2', email: 'b@example.com' });

    signIn({ backRedirectPath: '/invitation/abc' });

    expect(navigate).toHaveBeenCalledWith('/invitation/abc', { replace: true });
  });
});
