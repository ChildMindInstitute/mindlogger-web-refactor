import { useCallback } from 'react';

import { getMsFromHours, getMsFromMinutes, HourMinute } from '~/shared/utils';
import useTimer from '~/shared/utils/useTimer';

// Events that we consider as activity
export const events = ['click', 'keypress', 'keydown', 'mousemove', 'mousedown', 'touchstart'];

type Props = {
  time: HourMinute | null;
  onFinish: () => void;
};

export const useIdleTimer = (props: Props) => {
  const { resetTimer, setTimer } = useTimer();

  const onTimerExpire = useCallback(() => {
    // Listener clean up. Removes the existing event listener from the window
    Object.values(events).forEach((item) => {
      window.removeEventListener(item, resetTimer);
    });

    // Execute onComplete function
    if (props.onFinish) {
      props.onFinish();
    }
  }, [props, resetTimer]);

  const start = useCallback(
    (idleTimerName?: string) => {
      if (!props.time) {
        return;
      }

      const duration: number =
        getMsFromHours(props.time.hours) + getMsFromMinutes(props.time.minutes);

      setTimer({
        time: duration,
        onComplete: onTimerExpire,
        timerName: idleTimerName,
      });
    },
    [setTimer, props.time, onTimerExpire],
  );

  return {
    start,
  };
};
