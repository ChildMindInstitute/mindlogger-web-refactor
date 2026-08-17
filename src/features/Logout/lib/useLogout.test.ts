import { renderHook } from '@testing-library/react';

import { useLogout } from './useLogout';

import { useLogoutMutation } from '~/entities/user';
import {
  closeSessionSync,
  SESSION_CHANNEL_NAME,
  setLastActivityAt,
  subscribeSessionSync,
} from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';
import { InMemoryBroadcastChannel, resetInMemoryBroadcastChannels } from '~/test/utils';

const navigate = vi.fn();
const logoutMutate = vi.fn();

vi.mock('~/app/providers/react-query', () => ({ queryClient: { clear: vi.fn() } }));
vi.mock('~/entities/applet', () => ({
  appletModel: { hooks: { useClearStore: () => ({ clearStore: vi.fn() }) } },
}));
vi.mock('~/features/AutoCompletion', () => ({
  AutoCompletionModel: {
    useAutoCompletionStateManager: () => ({ clearAutoCompletionState: vi.fn() }),
  },
}));
vi.mock('~/entities/user', () => ({
  useLogoutMutation: vi.fn(),
  userModel: {
    hooks: { useUserState: () => ({ clearUser: vi.fn() }) },
    secureUserPrivateKeyStorage: { clearUserPrivateKey: vi.fn() },
  },
}));
vi.mock('react-router-dom', () => ({ useLocation: () => ({ pathname: '/', search: '' }) }));

vi.mock('~/shared/utils/storage/secureTokensStorage', () => ({
  secureTokensStorage: { getTokens: vi.fn(() => null), setTokens: vi.fn(), clearTokens: vi.fn() },
}));

vi.mock('~/shared/utils/hooks/useCustomNavigation', () => ({
  useCustomNavigation: () => ({ navigate }),
}));

const SESSION_ID = 'family-1';

const refreshTokenFor = (sessionId: string) =>
  `header.${window.btoa(JSON.stringify({ family: sessionId }))}.signature`;

// Listens as a second tab would. The subscriber stands in for this tab's engine, without which
// nothing is broadcast at all.
const openSiblingTab = () => {
  subscribeSessionSync(vi.fn());
  const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
  const onSiblingMessage = vi.fn();
  sibling.onmessage = onSiblingMessage;

  return onSiblingMessage;
};

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    vi.mocked(useLogoutMutation).mockReturnValue({
      mutate: logoutMutate,
      isLoading: false,
    } as never);
    vi.mocked(secureTokensStorage.getTokens).mockReturnValue({
      accessToken: 'access-1',
      refreshToken: refreshTokenFor(SESSION_ID),
      tokenType: 'Bearer',
    });
    // The session id is read out of storage, so the teardown has to take it away as it really does.
    vi.mocked(secureTokensStorage.clearTokens).mockImplementation(() =>
      vi.mocked(secureTokensStorage.getTokens).mockReturnValue(null),
    );
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
  });

  it('clears the activity clock, so the next sign-in is not judged by the last session', () => {
    setLastActivityAt(Date.now());

    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(localStorage.getItem('lastActivityAt')).toBeNull();
  });

  it('tells same-session tabs that the session is over', () => {
    const onSiblingMessage = openSiblingTab();

    const { result } = renderHook(() => useLogout());
    result.current.logout({ reason: 'idle' });

    expect(onSiblingMessage).toHaveBeenCalledWith({
      data: { type: 'LOGOUT', payload: { sessionId: SESSION_ID, reason: 'idle' } },
    });
    expect(logoutMutate).toHaveBeenCalledWith({ accessToken: 'access-1' });
  });

  it('neither revokes nor re-broadcasts when the logout came from another tab', () => {
    const onSiblingMessage = openSiblingTab();

    const { result } = renderHook(() => useLogout());
    result.current.logout({ isRemote: true });

    expect(logoutMutate).not.toHaveBeenCalled();
    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  it('still tears this tab down when the logout came from another tab', () => {
    setLastActivityAt(Date.now());

    const { result } = renderHook(() => useLogout());
    result.current.logout({ isRemote: true });

    expect(secureTokensStorage.clearTokens).toHaveBeenCalled();
    expect(localStorage.getItem('lastActivityAt')).toBeNull();
    expect(navigate).toHaveBeenCalled();
  });
});
