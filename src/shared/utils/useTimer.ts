import { useCallback, useRef } from 'react';

type EmptyFunction = () => void;

type SetTimerProps = {
  time: number;
  timerName?: string;
  onComplete?: EmptyFunction;
};

const useTimer = () => {
  const timerIDRef = useRef<number | null>(null);

  const onCompleteRef = useRef<EmptyFunction | null>(null);

  const resetTimer = useCallback(() => {
    window.clearTimeout(timerIDRef.current ?? undefined);
    timerIDRef.current = null;
  }, []);

  const setTimer = useCallback(
    ({ time: duration, onComplete }: SetTimerProps) => {
      // Clear any existing timer
      resetTimer();

      // Set the new onCompleteEvent callbacks
      if (onComplete) {
        onCompleteRef.current = onComplete;
      }

      timerIDRef.current = window.setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
        resetTimer();
      }, duration);
    },
    [resetTimer],
  );

  return {
    setTimer,
    resetTimer,
  };
};

export default useTimer;
