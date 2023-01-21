import { useNavigate } from "react-router-dom"

import { useLogoutMutation, userModel } from "~/entities/user"
import { ROUTES } from "~/shared/utils"

export const useAccountDropdown = () => {
  const navigate = useNavigate()
  const [user] = userModel.hooks.useUserState()
  const { mutate: logout, isLoading } = useLogoutMutation()

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
        if (user?.id) {
          logout({ accessToken: "TODO: add token here" })
        }
        navigate(ROUTES.login.path)
      },
    },
  ]

  return {
    accountDropdownOptions,
    logoutIsLoading: isLoading,
  }
}
