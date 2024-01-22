import { PropsWithChildren, useCallback, useEffect, useRef } from "react"

import { useLogout } from "~/features/Logout"

export type InactivityTrackerProps = PropsWithChildren<unknown>

const events = ["load", "click", "scroll", "keypress"]

const ONE_SEC = 1000
const ONE_MIN = 60 * ONE_SEC
const LOGOUT_TIME_LIMIT = 15 * ONE_MIN // 15 min

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const timerRef = useRef<number | undefined>(undefined)
  const { logout } = useLogout()

  // this resets the timer if it exists.
  const resetTimer = useCallback(() => {
    if (timerRef) window.clearTimeout(timerRef.current)
  }, [timerRef])

  const logoutTimer = useCallback(() => {
    timerRef.current = window.setTimeout(() => {
      // clears any pending timer.
      resetTimer()

      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach(item => {
        window.removeEventListener(item, resetTimer)
      })

      // logs out user
      logout()
    }, LOGOUT_TIME_LIMIT)
  }, [resetTimer, logout])

  const onActivityEventHandler = useCallback(() => {
    resetTimer()
    logoutTimer()
  }, [resetTimer, logoutTimer])

  useEffect(() => {
    Object.values(events).forEach(item => {
      window.addEventListener(item, onActivityEventHandler)
    })

    return () => {
      Object.values(events).forEach(item => {
        window.removeEventListener(item, onActivityEventHandler)
      })
    }
  }, [onActivityEventHandler])

  return children as JSX.Element
}
