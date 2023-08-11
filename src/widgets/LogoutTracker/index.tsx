import { PropsWithChildren, useCallback, useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { activityModel } from "~/entities/activity"
import { useLogoutMutation, userModel } from "~/entities/user"
import { ROUTES } from "~/shared/constants"
import { eventEmitter, secureTokensStorage } from "~/shared/utils"

type LogoutTrackerProps = PropsWithChildren<unknown>

export const LogoutTracker = ({ children }: LogoutTrackerProps) => {
  const navigate = useNavigate()
  const { mutate: logout } = useLogoutMutation()
  const tokens = userModel.hooks.useTokensState()
  const { clearUser } = userModel.hooks.useUserState()
  const { clearActivityInProgressState } = activityModel.hooks.useActivityClearState()

  const onLogoutEvent = useCallback(() => {
    if (tokens?.accessToken) {
      logout({ accessToken: tokens.accessToken })
    }

    secureTokensStorage.clearTokens()
    clearUser()
    clearActivityInProgressState()
    navigate(ROUTES.login.path)
  }, [clearUser, logout, navigate, tokens?.accessToken, clearActivityInProgressState])

  useEffect(() => {
    eventEmitter.on("onLogout", onLogoutEvent)

    return () => {
      eventEmitter.off("onLogout", onLogoutEvent)
    }
  }, [onLogoutEvent])

  return children as JSX.Element
}
