import { PropsWithChildren, useCallback, useEffect } from 'react';

import { useLogout } from '~/features/Logout';
import { useTimer } from '~/shared/utils';

export type InactivityTrackerProps = PropsWithChildren<unknown>;

const events = ['load', 'click', 'scroll', 'keypress', 'mousemove'];

const ONE_SEC = 1000;
const ONE_MIN = 60 * ONE_SEC;
const LOGOUT_TIME_LIMIT = 15 * ONE_MIN; // 15 min

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const { logout } = useLogout();
  const { resetTimer, setTimer } = useTimer();

  const onLogoutTimerExpire = useCallback(() => {
    // Listener clean up. Removes the existing event listener from the window
    Object.values(events).forEach((item) => {
      window.removeEventListener(item, resetTimer);
    });

    // logs out user
    logout();
  }, [logout, resetTimer]);

  const onActivityEventHandler = useCallback(() => {
    resetTimer();
    setTimer({ delay: LOGOUT_TIME_LIMIT, callback: onLogoutTimerExpire });
  }, [resetTimer, setTimer, onLogoutTimerExpire]);

  useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, onActivityEventHandler);
    });

    return () => {
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, onActivityEventHandler);
      });
    };
  }, [onActivityEventHandler]);

  return children as JSX.Element;
};
