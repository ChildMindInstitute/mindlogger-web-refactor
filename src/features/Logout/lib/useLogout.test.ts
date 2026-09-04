import { renderHook } from '@testing-library/react';

import { useLogout } from './useLogout';

import { persistor } from '~/app/store';
import { useLogoutMutation } from '~/entities/user';
import { userModel } from '~/entities/user';
import {
  closeSessionSync,
  SESSION_CHANNEL_NAME,
  setActiveSessionId,
  setLastActivityAt,
  subscribeSessionSync,
} from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';
import { InMemoryBroadcastChannel, resetInMemoryBroadcastChannels } from '~/test/utils';

const navigate = vi.fn();
const logoutMutate = vi.fn();

vi.mock('~/app/providers/react-query', () => ({ queryClient: { clear: vi.fn() } }));
vi.mock('~/app/store', () => ({ persistor: { flush: vi.fn() } }));
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

  // Persisting is left to a timer that a frozen tab never runs. Waking after someone else has
  // signed in, it would write this cleared user over theirs and sign them out of every tab.
  it('writes the cleared user out now rather than leaving it to a timer', () => {
    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(persistor.flush).toHaveBeenCalled();
  });

  it('writes it out on a logout that came from another tab too', () => {
    const { result } = renderHook(() => useLogout());
    result.current.logout({ isRemote: true });

    expect(persistor.flush).toHaveBeenCalled();
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

// What a tab duplicated before a logout wakes up to: its own snapshot still names the old session,
// while the browser has moved on to whoever signed in next.
describe('useLogout in a tab whose session was replaced', () => {
  const reload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    vi.stubGlobal('location', { ...window.location, reload });
    vi.mocked(useLogoutMutation).mockReturnValue({
      mutate: logoutMutate,
      isLoading: false,
    } as never);
    vi.mocked(secureTokensStorage.getTokens).mockReturnValue({
      accessToken: 'access-1',
      refreshToken: refreshTokenFor(SESSION_ID),
      tokenType: 'Bearer',
    });
    // Written by the tab that signed in after this one went to sleep.
    setActiveSessionId('family-2');
    setLastActivityAt(Date.now());
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    localStorage.clear();
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it('reloads into the live session instead of tearing down', () => {
    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(reload).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
  });

  // The bug this exists for: clearing here signs out whoever now holds the browser, and takes the
  // key their answers are encrypted with.
  it('leaves the tokens, key and clock of the session that replaced it alone', () => {
    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(secureTokensStorage.clearTokens).not.toHaveBeenCalled();
    expect(userModel.secureUserPrivateKeyStorage.clearUserPrivateKey).not.toHaveBeenCalled();
    expect(localStorage.getItem('lastActivityAt')).not.toBeNull();
  });

  it('does not ask the server to revoke a session it no longer holds', () => {
    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(logoutMutate).not.toHaveBeenCalled();
  });

  // Refusing has to come first of all: a session nobody holds has no business being announced.
  it("does not announce a logout for a session that is no longer the browser's", () => {
    const onSiblingMessage = openSiblingTab();

    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  it('drops the per-tab state of the session it is leaving behind', () => {
    sessionStorage.setItem('persist:banners', '{}');

    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(sessionStorage.getItem('persist:banners')).toBeNull();
  });

  it('tears down as usual once it owns the session again', () => {
    setActiveSessionId(SESSION_ID);

    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(reload).not.toHaveBeenCalled();
    expect(secureTokensStorage.clearTokens).toHaveBeenCalled();
  });
});
