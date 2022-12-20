import { Navigate, Outlet } from "react-router-dom"

import { ROUTES } from "./system/routes/constants"
import { InactivityTracker } from "./InactivityTracker"

export interface ProtectedRouteProps {
  redirectUrl?: string
  token: string | undefined
}

export const ProtectedRoute = ({ redirectUrl = ROUTES.login.path, token }: ProtectedRouteProps) => {
  if (!token) return <Navigate to={redirectUrl} replace />

  return (
    <InactivityTracker>
      <Outlet />
    </InactivityTracker>
  )
}
