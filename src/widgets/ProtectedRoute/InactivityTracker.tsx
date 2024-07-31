import { PropsWithChildren } from 'react';

import { useIdleTimer } from '~/features/IdleTimer';
import { useLogout } from '~/features/Logout';

export type InactivityTrackerProps = PropsWithChildren<unknown>;

const ONE_SEC = 1000;
const ONE_MIN = 60 * ONE_SEC;
const LOGOUT_TIME_LIMIT = 15 * ONE_MIN; // 15 min

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const { logout } = useLogout();

  useIdleTimer({
    time: LOGOUT_TIME_LIMIT,
    onFinish: logout,
  });

  return children as JSX.Element;
};
