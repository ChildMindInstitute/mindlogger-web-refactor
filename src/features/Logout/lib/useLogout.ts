import { useCallback } from "react"

import { appletModel } from "~/entities/applet"
import { useLogoutMutation, userModel } from "~/entities/user"
import { ROUTES } from "~/shared/constants"
import { Mixpanel, secureTokensStorage, useCustomNavigation } from "~/shared/utils"

type UseLogoutReturn = {
  logout: () => void
  isLoading: boolean
}

export const useLogout = (): UseLogoutReturn => {
  const navigator = useCustomNavigation()

  const { clearUser } = userModel.hooks.useUserState()
  const { resetAppletsStore } = appletModel.hooks.useResetAppletsStore()

  const { mutate: logoutMutation, isLoading } = useLogoutMutation()

  const logout = useCallback(() => {
    const tokens = secureTokensStorage.getTokens()

    if (tokens?.accessToken) {
      logoutMutation({ accessToken: tokens.accessToken })
    }

    clearUser()
    resetAppletsStore()
    secureTokensStorage.clearTokens()
    userModel.secureUserPrivateKeyStorage.clearUserPrivateKey()

    Mixpanel.track("logout")
    Mixpanel.logout()
    return navigator.navigate(ROUTES.login.path)
  }, [clearUser, logoutMutation, navigator, resetAppletsStore])

  return {
    logout,
    isLoading,
  }
}
