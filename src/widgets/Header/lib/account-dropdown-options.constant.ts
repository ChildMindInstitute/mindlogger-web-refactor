import { useNavigate } from "react-router-dom"

import { ROUTES } from "~/app/system/routes/constants"
import { useAuth } from "~/entities/user"

export const useAccountDropdown = () => {
  const navigate = useNavigate()
  const { clearUserAndAuth } = useAuth()

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
        clearUserAndAuth()
        navigate(ROUTES.login.path)
      },
    },
  ]

  return {
    accountDropdownOptions,
  }
}
