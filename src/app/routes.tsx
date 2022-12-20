import { Routes, Route } from "react-router-dom"

import { userAuthSelector } from "~/entities/user/model/auth.slice"
import { LoginPage } from "~/pages"

import { ProtectedRoute } from "./ProtectedRoute"
import { useAppSelector } from "./store"
import { ROUTES } from "./system/routes/constants"

const ApplicationRouter = (): JSX.Element | null => {
  const auth = useAppSelector(userAuthSelector)

  return (
    <Routes>
      <Route path={ROUTES.login.path} element={<LoginPage />} />
      <Route path={ROUTES.signup.path} element={<div>signup</div>} />
      <Route path={ROUTES.forgotPassword.path} element={<div>forgot password</div>} />

      <Route element={<ProtectedRoute token={auth.token} />}>
        <Route path={ROUTES.dashboard.path} element={<div>dashboard</div>} />
      </Route>
    </Routes>
  )
}

export default ApplicationRouter
