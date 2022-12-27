import { Routes, Route } from "react-router-dom"

import { userAuthSelector } from "~/entities"
import { LoginPage, SignupPage } from "~/pages"
import { ROUTES, useAppSelector } from "~/shared"

import { ProtectedRoute } from "./ProtectedRoute"

const ApplicationRouter = (): JSX.Element | null => {
  const auth = useAppSelector(userAuthSelector)

  return (
    <Routes>
      <Route path={ROUTES.login.path} element={<LoginPage />} />
      <Route path={ROUTES.signup.path} element={<SignupPage />} />
      <Route path={ROUTES.forgotPassword.path} element={<div>forgot password</div>} />

      <Route element={<ProtectedRoute token={auth.token} />}>
        <Route path={ROUTES.dashboard.path} element={<div>dashboard</div>} />
        <Route path={ROUTES.profile.path} element={<div>profile</div>} />
        <Route path={ROUTES.settings.path} element={<div>settings</div>} />
      </Route>
    </Routes>
  )
}

export default ApplicationRouter
