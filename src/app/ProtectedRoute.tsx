import { Navigate, Outlet } from "react-router-dom"

import { ROUTES } from "./system/routes/constants"

export interface ProtectedRouteProps {
  redirectUrl?: string
  token: string
}

export const ProtectedRoute = ({ redirectUrl = ROUTES.login.path, token }: ProtectedRouteProps) => {
  if (!token) return <Navigate to={redirectUrl} replace />

  return <Outlet />
}
