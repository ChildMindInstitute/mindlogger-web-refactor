import { PropsWithChildren, useCallback, useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { useLogoutMutation, userModel } from "~/entities/user"
import { eventEmitter, ROUTES, secureTokensStorage } from "~/shared/utils"

type LogoutTrackerProps = PropsWithChildren<unknown>

export const LogoutTracker = ({ children }: LogoutTrackerProps) => {
  const navigate = useNavigate()
  const { mutate: logout } = useLogoutMutation()
  const tokens = userModel.hooks.useTokensState()
  const { clearUser } = userModel.hooks.useUserState()

  const onLogoutEvent = useCallback(() => {
    if (tokens?.accessToken) {
      logout({ accessToken: tokens.accessToken })
    }

    secureTokensStorage.clearTokens()
    clearUser()
    navigate(ROUTES.login.path)
  }, [clearUser, logout, navigate, tokens?.accessToken])

  useEffect(() => {
    eventEmitter.on("onLogout", onLogoutEvent)

    return () => {
      eventEmitter.off("onLogout", onLogoutEvent)
    }
  }, [onLogoutEvent])

  return children as JSX.Element
}
