import { PropsWithChildren, useCallback, useEffect, useRef } from "react"

import { useNavigate } from "react-router-dom"

import { useLogoutMutation, userModel } from "~/entities/user"
import { ROUTES, secureTokensStorage } from "~/shared/utils"

export type InactivityTrackerProps = PropsWithChildren<{ token: string }>

const events = ["load", "click", "scroll", "keypress"]

const ONE_SEC = 1000
const ONE_MIN = 60 * ONE_SEC
const LOGOUT_TIME_LIMIT = 15 * ONE_MIN // 15 min

export const InactivityTracker = ({ children, token }: InactivityTrackerProps) => {
  const timerRef = useRef<number | undefined>(undefined)
  const navigate = useNavigate()
  const { clearUser } = userModel.hooks.useUserState()

  const { mutate: logout } = useLogoutMutation()

  // this resets the timer if it exists.
  const resetTimer = useCallback(() => {
    if (timerRef) clearTimeout(timerRef.current)
  }, [timerRef])

  const logoutAction = useCallback(() => {
    if (token) {
      logout({ accessToken: token })
    }

    clearUser()
    secureTokensStorage.clearTokens()
    navigate(ROUTES.login.path)
  }, [token, clearUser, navigate, logout])

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
