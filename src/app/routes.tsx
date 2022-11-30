import { Routes, Route } from "react-router-dom"
import { LoginPage } from "../pages"
import { ROUTES } from "./system/routes/constants"

const ApplicationRouter = (): JSX.Element | null => {
  return (
    <Routes>
      <Route path={ROUTES.main.path} element={<div>dashboard</div>} />
      <Route path={ROUTES.login.path} element={<LoginPage />} />
      <Route path={ROUTES.signup.path} element={<div>signup</div>} />
      <Route path={ROUTES.forgotPassword.path} element={<div>forgot password</div>} />
    </Routes>
  )
}

export default ApplicationRouter
