import { Suspense } from 'react';

import { fireEvent, screen } from '@testing-library/react';

import LoginPage from './index';

import { SESSION_ELSEWHERE_KEY } from '~/shared/utils/session/session.const';
import { getSessionReturn, setSessionReturn } from '~/shared/utils/session/sessionReturn';
import { renderWithProviders } from '~/test/utils';

vi.mock('~/features/Login', async () => {
  const actual = await vi.importActual<typeof import('~/features/Login')>('~/features/Login');

  return { ...actual, LoginForm: () => <div data-testid="login-form" /> };
});

// The page lazy-loads the mobile links, so everything below arrives a tick late.
const createAccountLink = () => screen.findByTestId('login-page-create-account');

const renderLoginPage = () =>
  renderWithProviders(
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>,
    {},
  );

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('while a session is running in another tab', () => {
    beforeEach(() => sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true'));

    // Signing up ends in a sign-in, so this is the second session by another door.
    it('turns the create account link away and marks it disabled', async () => {
      renderLoginPage();

      fireEvent.click(await createAccountLink());

      expect(await createAccountLink()).toHaveAttribute('aria-disabled', 'true');
    });

    // Nothing looks broken on arrival: pressing it is what shows there is no way through here.
    it('leaves the link usable until it is pressed', async () => {
      renderLoginPage();

      expect(await createAccountLink()).toHaveAttribute('aria-disabled', 'false');
    });
  });

  it('leaves the create account link working when no other session is running', async () => {
    renderLoginPage();

    fireEvent.click(await createAccountLink());

    // Navigating away is what working looks like here: the page goes with it.
    expect(screen.queryByTestId('login-page-create-account')).not.toBeInTheDocument();
  });

  describe('after a session that ended on its own', () => {
    beforeEach(() =>
      setSessionReturn({ path: '/protected/profile', userId: 'user-1', email: 'a@example.com' }),
    );

    // Otherwise the user is looking at a login page with no idea why.
    it('explains why the login page is showing', () => {
      const { store } = renderLoginPage();

      expect(store.getState().banners.banners.map(({ key }) => key)).toEqual([
        'SoftLockWarningBanner',
      ]);
    });

    it('withdraws the offer when the user heads off to make a new account', async () => {
      const { store } = renderLoginPage();

      fireEvent.click(await createAccountLink());

      expect(store.getState().banners.banners).toEqual([]);
      expect(getSessionReturn()).toBeNull();
    });
  });

  it('says nothing on a login page nobody was thrown out onto', () => {
    const { store } = renderLoginPage();

    expect(store.getState().banners.banners).toEqual([]);
  });
});
