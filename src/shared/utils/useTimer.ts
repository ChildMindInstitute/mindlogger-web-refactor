import { useCallback, useEffect, useRef, useState } from 'react';

const ONE_SECOND_IN_MILLISECONDS = 1000;

/**
 * Type representing an empty function.
 */
type EmptyFunction = () => void;

/**
 * Interface representing the properties for setting the timer.
 */
interface SetTimerProps {
  duration?: number;
  currentTime: number;
  onComplete?: EmptyFunction;
  onTick?: EmptyFunction;
}

type Props = {
  onComplete?: EmptyFunction;
  onTick?: EmptyFunction;
};

/**
 * Custom hook that provides timer functionality.
 * @param initialCallback The initial callback function to be executed when the timer ends.
 * @returns An object containing the current time, setTimer function, and resetTimer function.
 */
const useTimer = (props?: Props) => {
  const [duration, setDuration] = useState<number | null>(null); // Timer in miliseconds
  const [currentTime, setCurrentTime] = useState<number>(0); // Timer in miliseconds

  const timerRef = useRef<number | null>(null);
  const onCompleteCallbackRef = useRef<EmptyFunction | null>(null);
  const onTickCallbackRef = useRef<EmptyFunction | null>(null);

  /**
   * Sets the timer with the specified duration and callback function.
   * @param duration The duration of the timer in seconds.
   * @param currentTime The current time of the timer in seconds.
   * @param callback The callback function to be executed when the timer ends.
   */
  const setTimer = useCallback(({ duration, currentTime, onComplete, onTick }: SetTimerProps) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set the new onCompleteEvent callbacks
    onCompleteCallbackRef.current = () => {
      if (props?.onComplete) props.onComplete();
      if (onComplete) onComplete();
    };

    onTickCallbackRef.current = () => {
      if (props?.onTick) props.onTick();
      if (onTick) onTick();
    };

    // Set the timer
    setCurrentTime(currentTime * ONE_SECOND_IN_MILLISECONDS);
    duration && setDuration(duration * ONE_SECOND_IN_MILLISECONDS);

    timerRef.current = window.setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime <= 0) {
          timerRef.current && clearInterval(timerRef.current);
          timerRef.current = null;
          if (onCompleteCallbackRef.current) onCompleteCallbackRef.current();
          return 0;
        }

        if (onTickCallbackRef.current) onTickCallbackRef.current();

        return prevTime - ONE_SECOND_IN_MILLISECONDS; // Update timer every second
      });
    }, ONE_SECOND_IN_MILLISECONDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Resets the timer to zero and clears any existing timer.
   */
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentTime(0);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const percentageLeft = duration ? (currentTime / duration) * 100 : null;

  return {
    currentTime: currentTime / ONE_SECOND_IN_MILLISECONDS,
    duration: duration ? duration / ONE_SECOND_IN_MILLISECONDS : 0,
    setTimer,
    resetTimer,
    percentageLeft,
  };
};

export default useTimer;
