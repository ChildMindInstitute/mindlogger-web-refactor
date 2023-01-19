import { PropsWithChildren, useCallback, useEffect, useRef } from "react"

import { useNavigate } from "react-router-dom"

import { useAuth, useLogoutMutation } from "~/entities/user"
import { ROUTES } from "~/shared/utils"

export type InactivityTrackerProps = PropsWithChildren

const events = ["load", "click", "scroll", "keypress"]

const ONE_SEC = 1000
const ONE_MIN = 60 * ONE_SEC
const LOGOUT_TIME_LIMIT = 15 * ONE_MIN // 15 min

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  const timerRef = useRef<number | undefined>(undefined)
  const navigate = useNavigate()

  const { clearUserAndAuth, auth } = useAuth()
  const { mutate: logout } = useLogoutMutation()

  // this resets the timer if it exists.
  const resetTimer = useCallback(() => {
    if (timerRef) clearTimeout(timerRef.current)
  }, [timerRef])

  const logoutAction = useCallback(() => {
    if (auth.accessToken) {
      logout({ accessToken: auth.accessToken })
      clearUserAndAuth()
      navigate(ROUTES.login.path)
    }
  }, [navigate, auth.accessToken, logout, clearUserAndAuth])

  const logoutTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      // clears any pending timer.
      resetTimer()

      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach(item => {
        window.removeEventListener(item, resetTimer)
      })

      // logs out user
      logoutAction()
    }, LOGOUT_TIME_LIMIT)
  }, [resetTimer, logoutAction])

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
