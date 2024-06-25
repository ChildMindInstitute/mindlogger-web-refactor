import { EffectCallback, useEffect, useRef } from 'react';

/**
 * A convenience hook that runs the effect only once when the component mounts, which uses a ref to
 * help ensure that the effect runs only once during the component's lifetime.
 *
 * @param effect Some code that you'd normally put in a `useEffect` hook.
 */
export const useOnceEffect = (effect: EffectCallback) => {
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
