import { userModel } from "~/entities/user"

export const useAuthorizationGuard = () => {
  const { user } = userModel.hooks.useUserState()
  const tokens = userModel.hooks.useTokensState()

  const isAuthenticated = user.id && tokens?.accessToken

  return {
    isAuthenticated,
  }
}
