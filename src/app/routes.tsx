import { Routes, Route } from "react-router-dom"
import { LoginPage } from "../pages"
import { ROUTES } from "./system/routes/constants"

const ApplicationRouter = (): JSX.Element | null => {
  return (
    <Routes>
      <Route path={ROUTES.main.path} />
      <Route path={ROUTES.login.path} element={<LoginPage />} />
      <Route path={ROUTES.signup.path} />
    </Routes>
  )
}

export default ApplicationRouter
