import { useNavigate } from "react-router-dom"

import { useLogoutMutation, userModel } from "~/entities/user"
import { ROUTES } from "~/shared/utils"

export const useAccountDropdown = () => {
  const navigate = useNavigate()
  const { clearUser } = userModel.hooks.useUserState()

  const { mutate: logout, isLoading } = useLogoutMutation({
    onSuccess() {
      clearUser()
      userModel.secureTokensStorage.clearTokens()
      navigate(ROUTES.login.path)
    },
  })

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
        const tokens = userModel.secureTokensStorage.getTokens()

        if (tokens?.accessToken) {
          logout({ accessToken: tokens.accessToken })
        }
      },
    },
  ]

  return {
    accountDropdownOptions,
    logoutIsLoading: isLoading,
  }
}
