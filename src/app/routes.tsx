import { Routes, Route } from "react-router-dom"
import { ROUTES } from "./system/routes/constants"

const ApplicationRouter = (): JSX.Element | null => {
  return (
    <Routes>
      <Route path={ROUTES.main.path} />
      <Route path={ROUTES.login.path} />
      <Route path={ROUTES.signup.path} />
    </Routes>
  )
}

export default ApplicationRouter
