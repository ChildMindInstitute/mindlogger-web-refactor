import { fireEvent, screen, waitFor } from '@testing-library/react';

import { LoginForm } from './LoginForm';

import { SESSION_ELSEWHERE_KEY } from '~/shared/utils';
import { renderWithProviders } from '~/test/utils';

const login = vi.fn();
const onLoginSuccess = vi.fn();

vi.mock('~/entities/user', async () => {
  const actual = await vi.importActual<typeof import('~/entities/user')>('~/entities/user');

  return {
    ...actual,
    useLoginMutation: () => ({ mutate: login, isLoading: false }),
    userModel: {
      ...actual.userModel,
      hooks: { ...actual.userModel.hooks, useOnLogin: () => ({ onLoginSuccess }) },
    },
  };
});

const signInButton = () => screen.getByRole('button', { name: /button/i });

const fillIn = () => {
  fireEvent.change(screen.getByPlaceholderText('email'), {
    target: { value: 'someone@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'Password1!' } });
};

const renderLoginForm = () =>
  renderWithProviders(<LoginForm onMFARequired={vi.fn()} />, { disableRouter: false });

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('while a session is running in another tab', () => {
    beforeEach(() => sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true'));

    it('neither signs in nor leaves the button usable', async () => {
      renderLoginForm();
      fillIn();

      fireEvent.click(signInButton());

      await waitFor(() => expect(signInButton()).toBeDisabled());
      expect(login).not.toHaveBeenCalled();
    });

    // The form submits on Enter alone, so the guard cannot live on the button.
    it('turns away a submit that never touched the button', async () => {
      const { container } = renderLoginForm();
      fillIn();

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      await waitFor(() => expect(signInButton()).toBeDisabled());
      expect(login).not.toHaveBeenCalled();
    });

    // Nothing looks broken on arrival: pressing it is what shows there is no way through here.
    it('leaves the button usable until it is pressed', () => {
      renderLoginForm();

      expect(signInButton()).toBeEnabled();
    });
  });

  it('signs in as usual when no other session is running', async () => {
    renderLoginForm();
    fillIn();

    fireEvent.click(signInButton());

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    expect(signInButton()).toBeEnabled();
  });
});
