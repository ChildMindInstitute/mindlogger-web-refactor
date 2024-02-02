import { lazy } from "react"

const UnauthorizedRoutes = lazy(() => import("./UnauthorizedRoutes"))
const AuthorizedRoutes = lazy(() => import("./AuthorizedRoutes"))

import { userModel } from "~/entities/user"
import { useEntityProgressAutoCompletion } from "~/features/EntityProgressAutoCompletion"

function ApplicationRouter(): JSX.Element | null {
  const { isAuthorized, tokens } = userModel.hooks.useAuthorization()

  useEntityProgressAutoCompletion()

  if (isAuthorized) {
    return <AuthorizedRoutes refreshToken={tokens.refreshToken} />
  }

  return <UnauthorizedRoutes />
}

export default ApplicationRouter
