import { useCallback } from 'react';

import { getMsFromHours, getMsFromMinutes, HourMinute } from '~/shared/utils';
import useTimer from '~/shared/utils/useTimer';

type Props = {
  timerName?: string;
  onFinish: () => void;
  events: string[];
};

type CreateListenerProps = {
  time: HourMinute;
};

export const useIdleTimer = (props: Props) => {
  const { resetTimer, setTimer } = useTimer();

  const onTimerExpire = useCallback(() => {
    // Listener clean up. Removes the existing event listener from the window
    props.events.forEach((eventName) => {
      window.removeEventListener(eventName, resetTimer);
    });

    // Execute onComplete function
    if (props.onFinish) {
      props.onFinish();
    }
  }, [props, resetTimer]);

  const createListener = useCallback(
    (input: CreateListenerProps) => {
      return () => {
        const duration: number =
          getMsFromHours(input.time.hours) + getMsFromMinutes(input.time.minutes);

        setTimer({
          time: duration,
          onComplete: onTimerExpire,
          timerName: props.timerName,
        });
      };
    },
    [props.timerName, setTimer, onTimerExpire],
  );

  const start = useCallback(
    (listener: () => void) => {
      console.info(`[${props.timerName}] Idle timer has been started`);

      props.events.forEach((eventName) => {
        window.addEventListener(eventName, listener);
      });
    },
    [props.events, props.timerName],
  );

  const stop = useCallback(
    (listener: () => void) => {
      console.info(`[${props.timerName}] Idle timer has been removed`);

      props.events.forEach((eventName) => {
        window.removeEventListener(eventName, listener);
      });
    },
    [props.events, props.timerName],
  );

  return {
    start,
    stop,
    createListener,
  };
};
