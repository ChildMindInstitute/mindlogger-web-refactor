import { useNavigate } from "react-router-dom"

import { activityModel } from "~/entities/activity"
import { appletModel } from "~/entities/applet"
import { progressModel } from "~/entities/progress"
import { useLogoutMutation, userModel } from "~/entities/user"
import { ROUTES, secureTokensStorage } from "~/shared/utils"

type UseLogoutReturn = {
  logout: () => void
  isLoading: boolean
}

export const useLogout = (): UseLogoutReturn => {
  const navigate = useNavigate()
  const { clearUser } = userModel.hooks.useUserState()
  const { clearSelectedApplet } = appletModel.hooks.useAppletState()
  const { clearActivity } = activityModel.hooks.useActivityState()
  const { clearActivityInProgressState } = progressModel.hooks.useClearProgress()

  const clearStateBeforeLogout = () => {
    clearUser()
    clearSelectedApplet()
    clearActivity()
    clearActivityInProgressState()
  }

  const { mutate: logoutMutation, isLoading } = useLogoutMutation()

  const logout = () => {
    const tokens = secureTokensStorage.getTokens()

    if (tokens?.accessToken) {
      logoutMutation({ accessToken: tokens.accessToken })
    }

    clearStateBeforeLogout()
    secureTokensStorage.clearTokens()
    navigate(ROUTES.login.path)
  }

  return {
    logout,
    isLoading,
  }
}
