import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import AuthorizedRoutes from './AuthorizedRoutes';

import { setupStore } from '~/app/store';
import { setSessionReturn } from '~/shared/utils';

// The route table is the subject here, so its pages are stood in for. ProtectedRoute is stubbed as
// well: the real one mounts the keep-alive engine, which has nothing to do with where a redirect
// lands and would run timers for the length of the test.
vi.mock('./AppletListPage', () => ({ default: () => <div>applet list</div> }));
vi.mock('./Profile', () => ({ default: () => <div>profile</div> }));
vi.mock('~/abstract/ui/AppLayout', () => ({ default: () => <Outlet /> }));
vi.mock('~/widgets/Header', () => ({ default: () => null }));
vi.mock('~/widgets/Footer', () => ({ default: () => null }));
vi.mock('~/widgets/ProtectedRoute', () => ({ default: () => <Outlet /> }));
vi.mock('~/widgets/LogoutTracker', () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

const USER = { id: 'user-1', email: 'a@example.com', firstName: 'A', lastName: 'B' };

const renderAt = (entry: string | { pathname: string; state: unknown }) =>
  render(
    <Provider store={setupStore({ user: USER })}>
      <MemoryRouter initialEntries={[entry]}>
        <AuthorizedRoutes refreshToken="refresh" />
      </MemoryRouter>
    </Provider>,
  );

const recordFor = (userId: string) =>
  setSessionReturn({ path: '/protected/profile', userId, email: 'a@example.com' });

describe('AuthorizedRoutes', () => {
  beforeEach(() => sessionStorage.clear());

  // Arriving at the login route while signed in means arriving from outside: a bookmark, a typed
  // address, the back button.
  it('sends a signed-in tab at the login route into the app', () => {
    renderAt('/login');

    expect(screen.getByText('applet list')).toBeInTheDocument();
  });

  // The reported bug. Signing in sets the user a commit before the navigation lands, so this route
  // renders once while the URL still says /login. Sending everyone to the applet list from here
  // threw away the page the sign-in was already on its way to.
  it('does not overrule where a sign-in was already heading', () => {
    recordFor('user-1');

    renderAt('/login');

    expect(screen.getByText('profile')).toBeInTheDocument();
  });

  it('does not overrule a link the tab was carrying either', () => {
    renderAt({ pathname: '/login', state: { backRedirectPath: '/protected/profile' } });

    expect(screen.getByText('profile')).toBeInTheDocument();
  });

  it('resolves a path the app does not serve the same way', () => {
    recordFor('user-1');

    renderAt('/nonsense');

    expect(screen.getByText('profile')).toBeInTheDocument();
  });
});
