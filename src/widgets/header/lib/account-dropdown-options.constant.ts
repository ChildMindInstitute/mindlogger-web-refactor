import { useNavigate } from "react-router-dom"

import { ROUTES } from "~/app/system/routes/constants"
import { useAuth, useFetchLogout } from "~/entities"

export const useAccountDropdown = () => {
  const navigate = useNavigate()
  const { clearUserAndAuth, auth } = useAuth()
  const mutation = useFetchLogout({})

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
          mutation.mutate({ token: auth.token })
        }
        clearUserAndAuth()
        navigate(ROUTES.login.path)
      },
    },
  ]

  return {
    accountDropdownOptions,
    logoutIsLoading: mutation.isLoading,
  }
}
