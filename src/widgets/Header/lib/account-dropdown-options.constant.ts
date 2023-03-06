import { useNavigate } from "react-router-dom"

import { activityModel } from "~/entities/activity"
import { useLogoutMutation, userModel } from "~/entities/user"
import { ROUTES, secureTokensStorage } from "~/shared/utils"

export const useAccountDropdown = () => {
  const navigate = useNavigate()
  const { clearUser } = userModel.hooks.useUserState()
  const { clearActivityInProgressState } = activityModel.hooks.useActivityClearState()

  const { mutate: logoutMutation, isLoading } = useLogoutMutation()

  const logout = () => {
    const tokens = secureTokensStorage.getTokens()

    if (tokens?.accessToken) {
      logoutMutation({ accessToken: tokens.accessToken })
    }

    clearUser()
    clearActivityInProgressState()
    secureTokensStorage.clearTokens()
    navigate(ROUTES.login.path)
  }

  const accountDropdownOptions = [
    {
      tag: "profile",
      onSelect: () => {
        navigate(ROUTES.profile.path)
      },
    },
    {
      tag: "settings",
      onSelect: () => {
        navigate(ROUTES.settings.path)
      },
    },
    {
      tag: "logOut",
      onSelect: () => {
        logout()
      },
    },
  ]

  return {
    accountDropdownOptions,
    logoutIsLoading: isLoading,
  }
}
