import { PropsWithChildren, useEffect } from 'react';

import { useIdleTimer, events } from '~/features/IdleTimer';
import { useLogout } from '~/features/Logout';

export type InactivityTrackerProps = PropsWithChildren<unknown>;

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const { logout } = useLogout();

  const { activityEventsListener } = useIdleTimer({
    time: {
      hours: 0,
      minutes: 15,
    },
    onFinish: logout,
  });

  useEffect(() => {
    const listener = () => activityEventsListener('InactivityTracker');

    events.forEach((item) => {
      window.addEventListener(item, listener);
    });

    return () => {
      events.forEach((item) => {
        window.removeEventListener(item, listener);
      });
    };
  }, [activityEventsListener]);

  return children as JSX.Element;
};
