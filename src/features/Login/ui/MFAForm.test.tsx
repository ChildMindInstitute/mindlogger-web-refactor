import { fireEvent, screen, waitFor } from '@testing-library/react';

import { MFAForm } from './MFAForm';

import { SESSION_ELSEWHERE_KEY } from '~/shared/utils/session/session.const';
import { renderWithProviders } from '~/test/utils';

const verifyCode = vi.fn();

vi.mock('../lib/useMFAVerification', () => ({
  useMFAVerification: () => ({
    displayError: null,
    isSessionExpired: false,
    isSubmitting: false,
    verifyCode,
    clearError: vi.fn(),
  }),
}));

const submitButton = () => screen.getByRole('button', { name: /continue/i });

const renderMFAForm = () =>
  renderWithProviders(
    <MFAForm
      session={{ token: 'mfa-token', sessionId: 'session-1' }}
      onSuccess={vi.fn()}
      onSwitchToRecovery={vi.fn()}
      onBackToLogin={vi.fn()}
    />,
    {},
  );

describe('MFAForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('while a session is running in another tab', () => {
    beforeEach(() => sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true'));

    // Finishing MFA signs the user in, so it is the second session by another door.
    it('refuses a submitted code and quiets the button', async () => {
      const { container } = renderMFAForm();

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      await waitFor(() => expect(submitButton()).toBeDisabled());
      expect(verifyCode).not.toHaveBeenCalled();
    });

    // Six digits call handleSubmit directly rather than going through the form element, so the
    // form-level guard never sees this path. It needs its own.
    it('refuses the auto-submit that six digits trigger', async () => {
      renderMFAForm();

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456' } });

      await waitFor(() => expect(submitButton()).toBeDisabled());
      expect(verifyCode).not.toHaveBeenCalled();
    });

    it('leaves the button usable until it is pressed', () => {
      renderMFAForm();

      expect(submitButton()).toBeEnabled();
    });
  });

  it('verifies the code as usual when no other session is running', async () => {
    renderMFAForm();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456' } });

    await waitFor(() => expect(verifyCode).toHaveBeenCalledWith('123456'));
  });
});
