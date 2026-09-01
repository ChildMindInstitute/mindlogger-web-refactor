import { fireEvent, screen, waitFor } from '@testing-library/react';

import { RecoveryCodeForm } from './RecoveryCodeForm';

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

const renderRecoveryCodeForm = () =>
  renderWithProviders(
    <RecoveryCodeForm
      session={{ token: 'mfa-token', sessionId: 'session-1' }}
      onSuccess={vi.fn()}
      onSwitchToTOTP={vi.fn()}
      onBackToLogin={vi.fn()}
    />,
    {},
  );

describe('RecoveryCodeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('while a session is running in another tab', () => {
    beforeEach(() => sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true'));

    // A recovery code signs the user in just as the TOTP one does.
    it('refuses a submitted code and quiets the button', async () => {
      const { container } = renderRecoveryCodeForm();

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      await waitFor(() => expect(submitButton()).toBeDisabled());
      expect(verifyCode).not.toHaveBeenCalled();
    });

    it('leaves the button usable until it is pressed', () => {
      renderRecoveryCodeForm();

      expect(submitButton()).toBeEnabled();
    });
  });
});
