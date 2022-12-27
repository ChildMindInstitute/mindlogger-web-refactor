import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"

import AppStore from "~/assets/Appstore.svg"
import GooglePlay from "~/assets/GooglePlay.svg"

import { BasicButton, ROUTES } from "~/shared"
import { LoginForm, useLoginTranslation } from "~/features"

import { APPSTORE_LINK, GOOGLEPLAY_LINK } from "../lib/constants"

import "./login.scss"

const LoginPage = () => {
  const { t } = useLoginTranslation()

  return (
    <div className="loginPageContainer mp-3 align-self-start w-100">
      <div className="login text-center my-2 px-3">
        <Container>
          <h1 className="title-label">{t("welcomeMessage")}</h1>
          <h1 className="title-label">{t("appType")}</h1>
        </Container>

        <Container className="loginForm">
          <LoginForm />

          <BasicButton type="button" variant="outline-primary" className="mb-3">
            <Link to={ROUTES.signup.path} relative="path">
              {t("create")}
            </Link>
          </BasicButton>
        </Container>

        <Container>
          <Container className="mt-3 mb-2">
            <p>{t("downloadMobile")}</p>
          </Container>
          <Container className="d-flex gap-3 justify-content-center">
            <a href={APPSTORE_LINK} target="_blank" rel="noreferrer">
              <img src={AppStore} alt="App Store Icon" />
            </a>
            <a href={GOOGLEPLAY_LINK} target="_blank" rel="noreferrer">
              <img src={GooglePlay} alt="Google Play Icon" />
            </a>
          </Container>
        </Container>
      </div>
    </div>
  )
}

export default LoginPage
