import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ForgotPasswordForm } from './ForgotPasswordForm';

import { SESSION_ELSEWHERE_KEY } from '~/shared/utils/session/session.const';
import { renderWithProviders } from '~/test/utils';

const recoveryPassword = vi.fn();

vi.mock('~/entities/user', async () => {
  const actual = await vi.importActual<typeof import('~/entities/user')>('~/entities/user');

  return {
    ...actual,
    useRecoveryPasswordMutation: () => ({
      mutate: recoveryPassword,
      isLoading: false,
      isSuccess: false,
      error: null,
    }),
  };
});

const submitButton = () => screen.getByRole('button');

const renderForgotPasswordForm = () => renderWithProviders(<ForgotPasswordForm />, {});

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('while a session is running in another tab', () => {
    beforeEach(() => sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true'));

    // No session is started here, but a tab outside the live one does not act on its own.
    it('neither sends the link nor leaves the button usable', async () => {
      const { container } = renderForgotPasswordForm();
      fireEvent.change(screen.getByPlaceholderText('email'), {
        target: { value: 'a@example.com' },
      });

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      await waitFor(() => expect(submitButton()).toBeDisabled());
      expect(recoveryPassword).not.toHaveBeenCalled();
    });

    // The guard sits ahead of validation, so an empty form is turned away rather than told off.
    it('turns an empty form away rather than validating it', async () => {
      const { container } = renderForgotPasswordForm();

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      await waitFor(() => expect(submitButton()).toBeDisabled());
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    it('leaves the button usable until it is pressed', () => {
      renderForgotPasswordForm();

      expect(submitButton()).toBeEnabled();
    });
  });

  it('sends the link as usual when no other session is running', async () => {
    const { container } = renderForgotPasswordForm();
    fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: 'a@example.com' } });

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    await waitFor(() => expect(recoveryPassword).toHaveBeenCalledTimes(1));
    expect(submitButton()).toBeEnabled();
  });
});
