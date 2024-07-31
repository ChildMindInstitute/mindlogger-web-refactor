import { useCallback, useEffect } from 'react';

import useTimer from '~/shared/utils/useTimer';

export const events = ['click', 'keypress', 'keydown', 'mousemove', 'mousedown', 'touchstart'];

type Props = {
  time: number | null; // MS
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

  const activityEventsListener = useCallback(() => {
    if (!props.time) {
      return;
    }

    setTimer({
      time: props.time,
      onComplete: onTimerExpire,
      timerName: 'InactivityTracker',
    });
  }, [setTimer, props.time, onTimerExpire]);

  useEffect(() => {
    if (!props.time) {
      return;
    }

    events.forEach((item) => {
      window.addEventListener(item, activityEventsListener);
    });

    return () => {
      events.forEach((item) => {
        window.removeEventListener(item, activityEventsListener);
      });
    };
  }, [activityEventsListener, props.time]);

  return {
    activityEventsListener,
  };
};
