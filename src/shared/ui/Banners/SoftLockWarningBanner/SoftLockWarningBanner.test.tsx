import { render, screen } from '@testing-library/react';

import { SoftLockWarningBanner } from './index';

vi.mock('react-i18next', () => ({
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SoftLockWarningBanner', () => {
  it('says why the login page is showing, and what to do about it', () => {
    render(<SoftLockWarningBanner />);

    expect(screen.getByTestId('soft-lock-warning-banner')).toHaveTextContent(
      'To keep your account secure, you were automatically logged out. Enter your password below to resume where you left off.',
    );
  });
});
