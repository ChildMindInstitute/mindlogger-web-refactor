import { Navigate, Outlet } from "react-router-dom"

import { InactivityTracker } from "./InactivityTracker"

import { ROUTES } from "~/shared/utils"

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
