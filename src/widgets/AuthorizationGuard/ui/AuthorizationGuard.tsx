import { PropsWithChildren, ReactNode } from "react"

import { userModel } from "~/entities/user"

interface AuthorizationGuardProps extends PropsWithChildren {
  fallback: ReactNode
}

export const AuthorizationGuard = ({ fallback, children }: AuthorizationGuardProps) => {
  const { user } = userModel.hooks.useUserState()
  const tokens = userModel.hooks.useTokensState()

  const isAuthenticated = user.id && tokens?.accessToken

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
