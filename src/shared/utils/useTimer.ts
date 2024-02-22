import { useCallback, useRef } from "react"

type SetTimerProps = {
  callback: () => void
  delay: number
}

export const useTimer = () => {
  const timerRef = useRef<number | undefined>(undefined)

  // this resets the timer if it exists.
  const resetTimer = useCallback(() => {
    if (timerRef) window.clearTimeout(timerRef.current)
  }, [timerRef])

  const setTimer = useCallback(
    (props: SetTimerProps) => {
      timerRef.current = window.setTimeout(() => {
        // clears any pending timer.
        resetTimer()

        props.callback()
      }, props.delay)
    },
    [resetTimer],
  )

  return { setTimer, resetTimer }
}
