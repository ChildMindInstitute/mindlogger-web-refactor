import React from "react"

/**
 * A convenience hook that runs the effect only once, when the component mounts.
 * @param effect Some code that you'd normally put in a `useEffect` hook.
 */
export const useOnceEffect = (effect: React.EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(effect, [])
}
