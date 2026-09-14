import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import RedirectIntoApp from './index';

import { setupStore } from '~/app/store';
import { setSessionReturn } from '~/shared/utils';

const USER = { id: 'user-1', email: 'a@example.com', firstName: 'A', lastName: 'B' };

const renderAt = (entry: string | { pathname: string; state: unknown }) =>
  render(
    <Provider store={setupStore({ user: USER })}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/protected/applets" element={<div>applet list</div>} />
          <Route path="/protected/profile" element={<div>profile</div>} />
          <Route path="/invitation/abc" element={<div>invitation</div>} />
          <Route path="*" element={<RedirectIntoApp />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

const recordFor = (userId: string) =>
  setSessionReturn({ path: '/protected/profile', userId, email: 'a@example.com' });

describe('RedirectIntoApp', () => {
  beforeEach(() => sessionStorage.clear());

  it('sends a signed-in tab to the applet list by default', () => {
    renderAt('/login');

    expect(screen.getByText('applet list')).toBeInTheDocument();
  });

  it('sends it back to the page its own session ended on', () => {
    recordFor('user-1');

    renderAt('/login');

    expect(screen.getByText('profile')).toBeInTheDocument();
  });

  it('ignores a page recorded for somebody else', () => {
    recordFor('user-2');

    renderAt('/login');

    expect(screen.getByText('applet list')).toBeInTheDocument();
  });

  // The link is the more recent ask, so it wins over a page left behind by an earlier session.
  it('follows a link the tab was carrying ahead of either', () => {
    recordFor('user-1');

    renderAt({ pathname: '/login', state: { backRedirectPath: '/invitation/abc' } });

    expect(screen.getByText('invitation')).toBeInTheDocument();
  });

  it('resolves the same way for a path the app does not serve', () => {
    recordFor('user-1');

    renderAt('/nonsense');

    expect(screen.getByText('profile')).toBeInTheDocument();
  });
});
