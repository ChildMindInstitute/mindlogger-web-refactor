import { PropsWithChildren, useEffect } from 'react';

import { useIdleTimer } from './lib/useIdleTimer';

import { useLogout } from '~/features/Logout';
import { interactionEvents } from '~/shared/constants';

export type InactivityTrackerProps = PropsWithChildren<unknown>;

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const { logout } = useLogout();

  const IdleTimer = useIdleTimer({
    onFinish: logout,
    events: interactionEvents,
    timerName: 'InactivityTracker',
  });

  useEffect(() => {
    const listener = IdleTimer.createListener({
      time: { hours: 0, minutes: 15 },
    });

    IdleTimer.start(listener);

    return () => {
      IdleTimer.stop(listener);
    };

    // Should only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children as JSX.Element;
};
