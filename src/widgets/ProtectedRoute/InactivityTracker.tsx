import { PropsWithChildren, useEffect } from 'react';

import { useIdleTimer, events } from '~/features/IdleTimer';
import { useLogout } from '~/features/Logout';

export type InactivityTrackerProps = PropsWithChildren<unknown>;

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const { logout } = useLogout();

  const IdleTimer = useIdleTimer({
    time: {
      hours: 0,
      minutes: 15,
    },
    onFinish: logout,
  });

  useEffect(() => {
    const listener = () => IdleTimer.start('InactivityTracker');

    events.forEach((item) => {
      window.addEventListener(item, listener);
    });

    return () => {
      events.forEach((item) => {
        window.removeEventListener(item, listener);
      });
    };
  }, [IdleTimer]);

  return children as JSX.Element;
};
