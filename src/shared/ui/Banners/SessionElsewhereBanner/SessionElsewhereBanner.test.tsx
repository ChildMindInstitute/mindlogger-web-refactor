import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SessionElsewhereBanner } from './index';

vi.mock('react-i18next', () => ({
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const reload = vi.fn();

describe('SessionElsewhereBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('location', { ...window.location, reload });
  });

  it('tells the user a session is running elsewhere', () => {
    render(<SessionElsewhereBanner />);

    expect(screen.getByTestId('session-elsewhere-banner')).toHaveTextContent(
      'You signed in with another tab or window. Reload to refresh your session.',
    );
  });

  it('the reload link reloads the tab into the running session', () => {
    render(<SessionElsewhereBanner />);

    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
