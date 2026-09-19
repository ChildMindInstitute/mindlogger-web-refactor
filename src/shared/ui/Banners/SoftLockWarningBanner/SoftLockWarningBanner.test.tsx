import { render, screen } from '@testing-library/react';

import { SoftLockWarningBanner } from './index';

vi.mock('react-i18next', () => ({
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SoftLockWarningBanner', () => {
  // A sentence at a time: the space between them comes from the translation, and Trans is mocked
  // out above. The second one is its own block, so it reads on a line of its own.
  it('says why the login page is showing, and what to do about it', () => {
    render(<SoftLockWarningBanner />);

    const banner = screen.getByTestId('soft-lock-warning-banner');

    expect(banner).toHaveTextContent(
      'To keep your account secure, you were automatically logged out.',
    );
    expect(banner).toHaveTextContent(
      'Please enter your password below to resume where you left off.',
    );
  });
});
