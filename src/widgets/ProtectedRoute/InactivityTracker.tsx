import { PropsWithChildren } from 'react';

import { useIdleTimer } from '~/features/IdleTimer';
import { useLogout } from '~/features/Logout';

export type InactivityTrackerProps = PropsWithChildren<unknown>;

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const { logout } = useLogout();

  useIdleTimer({
    time: {
      hours: 0,
      minutes: 15,
    },
    onFinish: logout,
  });

  return children as JSX.Element;
};
