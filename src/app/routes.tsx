import { Routes, Route, Navigate } from "react-router-dom"

import { userAuthSelector } from "~/entities/user"
import { ChangePasswordPage, ForgotPasswordPage, LoginPage, SettingsPage, SignupPage } from "~/pages"
import { ROUTES, useAppSelector } from "~/shared"

import { ProtectedRoute } from "./ProtectedRoute"

const ApplicationRouter = (): JSX.Element | null => {
  const auth = useAppSelector(userAuthSelector)

  return (
    <Routes>
      <Route index path={ROUTES.login.path} element={<LoginPage />} />
      <Route path={ROUTES.signup.path} element={<SignupPage />} />
      <Route path={ROUTES.forgotPassword.path} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.changePassword.path} element={<ChangePasswordPage />} />

      <Route element={<ProtectedRoute token={auth.token} />}>
        <Route index path={ROUTES.dashboard.path} element={<div>dashboard</div>} />
        <Route path={ROUTES.profile.path} element={<div>profile</div>} />
        <Route path={ROUTES.settings.path} element={<SettingsPage />} />

        <Route path="*" element={<Navigate to={ROUTES.dashboard.path} />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.login.path} />} />
    </Routes>
  )
}

export default ApplicationRouter
