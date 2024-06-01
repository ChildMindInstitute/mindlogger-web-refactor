import { useCallback, useRef, useState } from 'react';

const ONE_SEC = 1000;

type EmptyFunction = () => void;

type SetTimerProps = {
  time: number;
  onComplete?: EmptyFunction;
  onTick?: EmptyFunction;
};

const useTimer = () => {
  const [time, setTime] = useState<number | null>(null); // Miliseconds

  const timerRef = useRef<number | null>(null);

  const onCompleteCallbackRef = useRef<EmptyFunction | null>(null);

  const onTickCallbackRef = useRef<EmptyFunction | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTime(null);
  }, []);

  const setTimer = useCallback(
    ({ time: timerTime, onComplete, onTick }: SetTimerProps) => {
      // Clear any existing timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      // Set the new onCompleteEvent callbacks
      onCompleteCallbackRef.current = () => {
        if (onComplete) onComplete();
      };

      onTickCallbackRef.current = () => {
        if (onTick) onTick();
      };

      // Set the timer
      setTime(timerTime);

      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === null) return null;

          if (prevTime <= 0) {
            if (onCompleteCallbackRef.current) onCompleteCallbackRef.current();
            resetTimer();
            return null;
          }

          if (onTickCallbackRef.current) onTickCallbackRef.current();
          return prevTime - ONE_SEC;
        });
      }, ONE_SEC);
    },
    [resetTimer],
  );

  return {
    time,
    setTimer,
    resetTimer,
  };
};

export default useTimer;
