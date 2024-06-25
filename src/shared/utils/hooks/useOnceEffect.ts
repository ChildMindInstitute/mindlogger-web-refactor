import type { EffectCallback } from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * A convenience hook that runs the effect only once, when the component mounts.
 * @param effect Some code that you'd normally put in a `useEffect` hook.
 */
export const useOnceEffect = (effect: EffectCallback) => {
  const previouslyMounted = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (previouslyMounted.current) {
      return;
    } else {
      previouslyMounted.current = true;
    }

    effect();
  }, []);
};

/**
 * A convenience hook that runs the effect only once, when the component mounts.
 * @param effect Some code that you'd normally put in a `useLayoutEffect` hook.
 */
export const useOnceLayoutEffect = (effect: EffectCallback) => {
  const executed = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (executed.current) {
      return;
    } else {
      executed.current = true;
    }

    effect();
  }, []);
};
