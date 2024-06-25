import { useEffect, useRef } from 'react';
import type { EffectCallback } from 'react';

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
