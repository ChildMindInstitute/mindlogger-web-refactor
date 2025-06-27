import { PropsWithChildren, useEffect } from 'react';

import { useIdleTimer } from './lib/useIdleTimer';

import { useLogout } from '~/features/Logout';
import { interactionEvents } from '~/shared/constants';

export type InactivityTrackerProps = PropsWithChildren<unknown>;

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const { logout } = useLogout();

  const IdleTimer = useIdleTimer({
    events: interactionEvents,
    timerName: 'InactivityTracker',
  });

  useEffect(() => {
    const time = { hours: 0, minutes: 15 };

    const listener = IdleTimer.createListener(time, logout);

    IdleTimer.start(listener);

    return () => {
      IdleTimer.stop(listener);
    };
  }, [IdleTimer, logout]);

  return children as JSX.Element;
};
