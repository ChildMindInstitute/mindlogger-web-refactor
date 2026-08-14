import { renderHook } from '@testing-library/react';

import { useLogout } from './useLogout';

import { setLastActivityAt } from '~/shared/utils';

const navigate = vi.fn();

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
  useLogoutMutation: () => ({ mutate: vi.fn(), isLoading: false }),
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

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('clears the activity clock, so the next sign-in is not judged by the last session', () => {
    setLastActivityAt(Date.now());

    const { result } = renderHook(() => useLogout());
    result.current.logout();

    expect(localStorage.getItem('lastActivityAt')).toBeNull();
  });
});
