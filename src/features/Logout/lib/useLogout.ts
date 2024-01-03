import { useNavigate } from "react-router-dom"

import { appletModel } from "~/entities/applet"
import { useLogoutMutation, userModel } from "~/entities/user"
import { ROUTES } from "~/shared/constants"
import { Mixpanel, secureTokensStorage } from "~/shared/utils"

type UseLogoutReturn = {
  logout: () => void
  isLoading: boolean
}

export const useLogout = (): UseLogoutReturn => {
  const navigate = useNavigate()
  const { clearUser } = userModel.hooks.useUserState()
  const { clearActivityInProgressState } = appletModel.hooks.useActivityClearState()

  const { mutate: logoutMutation, isLoading } = useLogoutMutation()

  const logout = () => {
    const tokens = secureTokensStorage.getTokens()

    if (tokens?.accessToken) {
      logoutMutation({ accessToken: tokens.accessToken })
    }

    clearUser()
    clearActivityInProgressState()
    secureTokensStorage.clearTokens()

    Mixpanel.track("logout")
    Mixpanel.logout()
    return navigate(ROUTES.login.path)
  }

  return {
    logout,
    isLoading,
  }
}
