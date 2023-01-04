import { Navigate, Route, Routes } from "react-router-dom"

import { userAuthSelector } from "~/entities/user"
import { ROUTES, useAppSelector } from "~/shared/utils"
import { ProtectedRoute } from "~/features/ProtectedRoute"

import ChangePassword from "./ChangePassword"
import ForgotPassword from "./ForgotPassword"
import LoginPage from "./Login"
import Settings from "./Settings"
import SignupPage from "./Signup"
import Profile from "./Profile"

const ApplicationRouter = (): JSX.Element | null => {
  const auth = useAppSelector(userAuthSelector)

  return (
    <Routes>
      <Route index path={ROUTES.login.path} element={<LoginPage />} />
      <Route path={ROUTES.signup.path} element={<SignupPage />} />
      <Route path={ROUTES.forgotPassword.path} element={<ForgotPassword />} />
      <Route path={ROUTES.changePassword.path} element={<ChangePassword />} />

      <Route element={<ProtectedRoute token={auth.token} />}>
        <Route index path={ROUTES.dashboard.path} element={<div>dashboard</div>} />
        <Route path={ROUTES.profile.path} element={<Profile />} />
        <Route path={ROUTES.settings.path} element={<Settings />} />

        <Route path="*" element={<Navigate to={ROUTES.dashboard.path} />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.login.path} />} />
    </Routes>
  )
}

export default ApplicationRouter
