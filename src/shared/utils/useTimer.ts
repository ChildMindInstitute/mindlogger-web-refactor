import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Type representing an empty function.
 */
type EmptyFunction = () => void;

/**
 * Interface representing the properties for setting the timer.
 */
interface SetTimerProps {
  duration: number;
  callback?: EmptyFunction;
}

/**
 * Custom hook that provides timer functionality.
 * @param initialCallback The initial callback function to be executed when the timer ends.
 * @returns An object containing the current time, setTimer function, and resetTimer function.
 */
const useTimer = (initialCallback: EmptyFunction | null = null) => {
  const [initialTime, setInitialTime] = useState<number | null>(null); // Timer in miliseconds
  const [currentTime, setCurrentTime] = useState<number>(0); // Timer in miliseconds

  const timerRef = useRef<number | null>(null);
  const callbackRef = useRef<EmptyFunction | null>(initialCallback);

  /**
   * Sets the timer with the specified duration and callback function.
   * @param duration The duration of the timer in miliseconds.
   * @param callback The callback function to be executed when the timer ends.
   */
  const setTimer = useCallback(({ duration, callback }: SetTimerProps) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set the new callback
    callbackRef.current = () => {
      if (initialCallback) initialCallback();
      if (callback) callback();
    };

    // Set the timer
    setCurrentTime(duration);
    setInitialTime(duration);

    timerRef.current = window.setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime <= 0) {
          timerRef.current && clearInterval(timerRef.current);
          timerRef.current = null;
          if (callbackRef.current) callbackRef.current();
          return 0;
        }
        return prevTime - 1000; // Update timer every second
      });
    }, 1000);
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

  const percentageLeft = initialTime ? (currentTime / initialTime) * 100 : null;

  return {
    currentTime,
    setTimer,
    resetTimer,
    percentageLeft,
  };
};

export default useTimer;
