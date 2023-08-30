import { useEffect } from "react"

import { Container } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"

import { LoginForm, useLoginTranslation } from "~/features/Login"
import { BasicButton } from "~/shared/ui"
import { Mixpanel, ROUTES } from "~/shared/utils"
import DownloadMobileLinks from "~/widgets/DownloadMobileLinks"

import "./login.scss"

const LoginPage = () => {
  const { t } = useLoginTranslation()
  const location = useLocation()

  const onCreateAccountClick = () => {
    Mixpanel.track("Create account button on login screen click")
  }

  useEffect(() => {
    Mixpanel.trackPageView("Login")
  }, [])

  return (
    <div className="loginPageContainer mp-3 align-self-start w-100">
      <div className="login text-center my-2 px-3">
        <Container>
          <h1 className="title-label">{t("welcomeMessage")}</h1>
          <h1 className="title-label">{t("appType")}</h1>
        </Container>

        <Container className="loginForm">
          <LoginForm locationState={location.state} />

          <BasicButton type="button" variant="outline-primary" className="mb-3" defaultSize>
            <Link to={ROUTES.signup.path} relative="path" onClick={onCreateAccountClick}>
              {t("create")}
            </Link>
          </BasicButton>
        </Container>

        <DownloadMobileLinks />
      </div>
    </div>
  )
}

export default LoginPage
