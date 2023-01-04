import { useNavigate } from "react-router-dom"

import { ROUTES } from "~/shared"
import { useAuth, useLogoutMutation } from "~/entities/user"

export const useAccountDropdown = () => {
  const navigate = useNavigate()
  const { clearUserAndAuth, auth } = useAuth()
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
        if (auth.token) {
          logout({ token: auth.token })
        }
        clearUserAndAuth()
        navigate(ROUTES.login.path)
      },
    },
  ]

  return {
    accountDropdownOptions,
    logoutIsLoading: isLoading,
  }
}
