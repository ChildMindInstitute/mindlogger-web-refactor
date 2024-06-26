import { EffectCallback, useLayoutEffect, useRef } from 'react';

/**
 * A convenience hook that runs the layout effect only once, and uses a ref to
 * help ensure that the effect runs only once during the component's lifetime.
 *
 * @param effect Some code that you'd normally put in a `useLayoutEffect` hook.
 */
export const useOnceLayoutEffect = (effect: EffectCallback) => {
  const hasExecutedRef = useRef(false);

  useLayoutEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
