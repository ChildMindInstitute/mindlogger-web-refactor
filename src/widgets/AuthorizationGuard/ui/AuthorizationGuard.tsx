import { PropsWithChildren, ReactNode } from "react"

import { useAuthorizationGuard } from "../lib"

interface AuthorizationGuardProps extends PropsWithChildren {
  fallback: ReactNode
}

export const AuthorizationGuard = ({ fallback, children }: AuthorizationGuardProps) => {
  const { isAuthenticated } = useAuthorizationGuard()

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
