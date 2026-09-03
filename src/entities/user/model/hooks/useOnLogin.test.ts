import { act, renderHook } from '@testing-library/react';

import { useOnLogin } from './useOnLogin';

import { clearSessionEnded, consumeSessionEnded, SESSION_ENDED_KEY } from '~/shared/utils';

const navigate = vi.fn();
const setUser = vi.fn();

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

const signIn = () => {
  const { result } = renderHook(() => useOnLogin({}));

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
    clearSessionEnded();
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
});
