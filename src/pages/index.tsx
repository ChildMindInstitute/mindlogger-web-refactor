import { Navigate, Route, Routes } from "react-router-dom"

import ChangePassword from "./ChangePassword"
import Dashboard from "./Dashboard"
import ForgotPassword from "./ForgotPassword"
import LoginPage from "./Login"
import Profile from "./Profile"
import Settings from "./Settings"
import SignupPage from "./Signup"

import { userModel } from "~/entities/user"
import { ProtectedRoute } from "~/features/ProtectedRoute"
import { ROUTES } from "~/shared/utils"

const ApplicationRouter = (): JSX.Element | null => {
  const tokens = userModel.hooks.useTokensState()

  if (tokens?.accessToken) {
    return (
      <Routes>
        <Route element={<ProtectedRoute token={tokens?.accessToken} />}>
          <Route index path={ROUTES.dashboard.path} element={<Dashboard />} />
          <Route path={ROUTES.profile.path} element={<Profile />} />
          <Route path={ROUTES.settings.path} element={<Settings />} />

          <Route path="*" element={<Navigate to={ROUTES.dashboard.path} />} />
        </Route>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route index path={ROUTES.login.path} element={<LoginPage />} />
      <Route path={ROUTES.signup.path} element={<SignupPage />} />
      <Route path={ROUTES.forgotPassword.path} element={<ForgotPassword />} />
      <Route path={ROUTES.changePassword.path} element={<ChangePassword />} />

      <Route path="*" element={<Navigate to={ROUTES.login.path} />} />
    </Routes>
  )
}

export default ApplicationRouter
