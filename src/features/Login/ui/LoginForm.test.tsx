import { ComponentProps } from 'react';

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
const forgotPasswordLink = () => screen.getByTestId('login-form-forgot-password');

const fillIn = () => {
  fireEvent.change(screen.getByPlaceholderText('email'), {
    target: { value: 'someone@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'Password1!' } });
};

const renderLoginForm = (props: Partial<ComponentProps<typeof LoginForm>> = {}) =>
  renderWithProviders(<LoginForm onMFARequired={vi.fn()} {...props} />, { disableRouter: false });

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
      expect(forgotPasswordLink()).toHaveAttribute('aria-disabled', 'false');
    });

    // An anchor cannot be disabled, so refusing has to leave its own mark.
    it('turns the forgot password link away and marks it disabled', () => {
      renderLoginForm();

      fireEvent.click(forgotPasswordLink());

      expect(forgotPasswordLink()).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('leaves the forgot password link working when no other session is running', () => {
    renderLoginForm();

    fireEvent.click(forgotPasswordLink());

    // Navigating away is what working looks like here: the form goes with it.
    expect(screen.queryByTestId('login-form-forgot-password')).not.toBeInTheDocument();
  });

  it('signs in as usual when no other session is running', async () => {
    renderLoginForm();
    fillIn();

    fireEvent.click(signInButton());

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    expect(signInButton()).toBeEnabled();
  });

  // The session that ended was this user's, so they are asked for a password and nothing more.
  it('fills in the email of the session that ended on its own', () => {
    renderLoginForm({ softLockEmail: 'a@example.com' });

    expect(screen.getByPlaceholderText('email')).toHaveValue('a@example.com');
  });

  it('withdraws that offer when the user heads for a password reset', () => {
    const onDismissSoftLock = vi.fn();
    renderLoginForm({ softLockEmail: 'a@example.com', onDismissSoftLock });

    fireEvent.click(forgotPasswordLink());

    expect(onDismissSoftLock).toHaveBeenCalled();
  });

  // The press never gets as far as leaving, so there is nothing to withdraw.
  it('leaves the offer alone when that press was refused', () => {
    sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true');
    const onDismissSoftLock = vi.fn();
    renderLoginForm({ softLockEmail: 'a@example.com', onDismissSoftLock });

    fireEvent.click(forgotPasswordLink());

    expect(onDismissSoftLock).not.toHaveBeenCalled();
  });
});
