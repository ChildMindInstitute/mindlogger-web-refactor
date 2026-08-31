import { Suspense } from 'react';

import { screen, waitFor } from '@testing-library/react';

import ApplicationRouter from './index';

import { SESSION_ENDED_KEY } from '~/shared/utils';
import { renderWithProviders } from '~/test/utils';

vi.mock('./AuthorizedRoutes', () => ({
  default: () => <div data-testid="authorized-routes" />,
}));

vi.mock('./UnauthorizedRoutes', () => ({
  default: () => <div data-testid="unauthorized-routes" />,
}));

vi.mock('~/widgets/SessionKeepAlive', () => ({ useSessionAdoption: vi.fn() }));

const useAuthorization = vi.fn();

vi.mock('~/entities/user', async () => {
  const actual = await vi.importActual<typeof import('~/entities/user')>('~/entities/user');

  return {
    ...actual,
    userModel: {
      ...actual.userModel,
      hooks: { ...actual.userModel.hooks, useAuthorization: () => useAuthorization() },
    },
  };
});

const holdSession = () =>
  useAuthorization.mockReturnValue({
    isAuthorized: true,
    user: { id: 'user-1' },
    tokens: { accessToken: 'access', refreshToken: 'refresh', tokenType: 'Bearer' },
  });

const renderRouter = () =>
  renderWithProviders(
    <Suspense fallback={null}>
      <ApplicationRouter />
    </Suspense>,
    {},
  );

describe('ApplicationRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    useAuthorization.mockReturnValue({ isAuthorized: false, user: null, tokens: null });
  });

  it('shows the app to a tab that holds a session', async () => {
    holdSession();

    renderRouter();

    await waitFor(() => expect(screen.getByTestId('authorized-routes')).toBeInTheDocument());
  });

  // The tokens belong to whoever signed in after this tab went to sleep.
  it('shows the login page instead when the session has ended', async () => {
    holdSession();
    sessionStorage.setItem(SESSION_ENDED_KEY, 'true');

    renderRouter();

    await waitFor(() => expect(screen.getByTestId('unauthorized-routes')).toBeInTheDocument());
  });

  it('shows the login page to a tab with no session at all', async () => {
    renderRouter();

    await waitFor(() => expect(screen.getByTestId('unauthorized-routes')).toBeInTheDocument());
  });
});
