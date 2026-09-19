import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SessionElsewhereBanner } from './index';

import { SESSION_ENDED_KEY } from '~/shared/utils/session/session.const';

vi.mock('react-i18next', () => ({
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const reload = vi.fn();

describe('SessionElsewhereBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
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

  // Left by leaveEndedSession to keep this boot out of the session. Reloading is the user asking to
  // go in, so it cannot survive and turn the next boot away too.
  it('clears the ended marker on the way, so the reload lands in the session', () => {
    sessionStorage.setItem(SESSION_ENDED_KEY, 'true');
    render(<SessionElsewhereBanner />);

    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));

    expect(sessionStorage.getItem(SESSION_ENDED_KEY)).toBeNull();
  });
});
