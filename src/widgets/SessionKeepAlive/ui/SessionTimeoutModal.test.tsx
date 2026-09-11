import { fireEvent, render, screen } from '@testing-library/react';

import { SessionTimeoutModal } from './SessionTimeoutModal';

import { MS_IN_MIN, MS_IN_SEC } from '~/shared/utils';

// i18next is not initialised under vitest, so keys render bare. Interpolation is kept visible so
// the countdown reaching the copy can still be asserted.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) =>
      options?.countdown ? `${key} ${options.countdown}` : key,
    i18n: { language: 'en' },
  }),
}));

const onStayLoggedIn = vi.fn();
const onLogOut = vi.fn();

const renderModal = (msRemaining = 5 * MS_IN_MIN) =>
  render(
    <SessionTimeoutModal
      msRemaining={msRemaining}
      onStayLoggedIn={onStayLoggedIn}
      onLogOut={onLogOut}
    />,
  );

describe('SessionTimeoutModal', () => {
  afterEach(() => vi.clearAllMocks());

  it('asks whether the user is still there', () => {
    renderModal();

    expect(screen.getByTestId('session-timeout-modal')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('spells out how long is left to answer', () => {
    renderModal(4 * MS_IN_MIN + 7 * MS_IN_SEC);

    expect(screen.getByText('description 4:07')).toBeInTheDocument();
  });

  it('staying logged in answers the countdown', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'stayLoggedIn' }));

    expect(onStayLoggedIn).toHaveBeenCalledTimes(1);
    expect(onLogOut).not.toHaveBeenCalled();
  });

  it('logging out ends the session instead', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'logOut' }));

    expect(onLogOut).toHaveBeenCalledTimes(1);
    expect(onStayLoggedIn).not.toHaveBeenCalled();
  });

  // Dismissing without answering would leave the countdown running where nobody can see it.
  it('closing it by the X keeps the session', () => {
    renderModal();

    fireEvent.click(screen.getByTestId('customized-dialog-close-icon'));

    expect(onStayLoggedIn).toHaveBeenCalledTimes(1);
    expect(onLogOut).not.toHaveBeenCalled();
  });

  it('clicking away from it keeps the session too', () => {
    const { baseElement } = renderModal();

    fireEvent.click(baseElement.querySelector('.MuiBackdrop-root') as Element);

    expect(onStayLoggedIn).toHaveBeenCalledTimes(1);
    expect(onLogOut).not.toHaveBeenCalled();
  });
});
