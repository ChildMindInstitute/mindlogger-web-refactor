import { useCallback } from 'react';

import { getMsFromHours, getMsFromMinutes, HourMinute } from '~/shared/utils';
import useTimer from '~/shared/utils/useTimer';

type Props = {
  timerName?: string;
  events: string[];
};

export const useIdleTimer = (props: Props) => {
  const { setTimer, resetTimer } = useTimer();

  const createListener = useCallback(
    (time: HourMinute, onFinish: () => void) => {
      return () => {
        const duration: number = getMsFromHours(time.hours) + getMsFromMinutes(time.minutes);

        setTimer({
          time: duration,
          timerName: props.timerName,
          onComplete: onFinish,
        });
      };
    },
    [props.timerName, setTimer],
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

      resetTimer();

      props.events.forEach((eventName) => {
        window.removeEventListener(eventName, listener);
      });
    },
    [props.events, props.timerName, resetTimer],
  );

  return {
    start,
    stop,
    createListener,
  };
};
