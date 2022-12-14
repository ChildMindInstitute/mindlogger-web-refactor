import { PropsWithChildren, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "~/entities/user"

import { ROUTES } from "./system/routes/constants"
import { useAppDispatch } from "./store"

export type InactivityTrackerProps = PropsWithChildren

const events = ["load", "click", "scroll", "keypress"]

const ONE_SEC = 1000
const ONE_MIN = 60 * ONE_SEC
const LOGOUT_TIME_LIMIT = 15 * ONE_MIN // 15 min

export const InactivityTracker = ({ children }: InactivityTrackerProps) => {
  let timer: number | undefined
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { clearUserAndAuth } = useAuth()

  // this resets the timer if it exists.
  const resetTimer = () => {
    if (timer) clearTimeout(timer)
  }

  const logoutAction = () => {
    clearUserAndAuth()
    navigate(ROUTES.login.path)
  }

  const logoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer()

      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach(item => {
        window.removeEventListener(item, resetTimer)
      })

      // logs out user
      logoutAction()
    }, LOGOUT_TIME_LIMIT)
  }

  useState(() => {
    Object.values(events).forEach(item => {
      window.addEventListener(item, () => {
        resetTimer()
        logoutTimer()
      })
    })
  })

  return children as JSX.Element
}
