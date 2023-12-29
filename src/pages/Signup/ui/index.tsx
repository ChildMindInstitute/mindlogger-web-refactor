import { useEffect } from "react"

import { Container } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"

import { SignupForm, useSignupTranslation } from "~/features/Signup"
import { Mixpanel, ROUTES } from "~/shared/utils"

import "./styles.scss"

const SignupPage = () => {
  const { t } = useSignupTranslation()
  const location = useLocation()

  useEffect(() => {
    Mixpanel.trackPageView("Create account")
  }, [])

  return (
    <div className="signupPageContainer align-self-start pt-5 mb-3 w-100">
      <div className="signup text-center my-2 px-3">
        <h1>{t("title")}</h1>

        <Container className="signupForm">
          <SignupForm locationState={location.state} />

          <p className="my-3">
            {t("account")} <Link to={ROUTES.login.path}> {t("logIn")}</Link>
          </p>
        </Container>
      </div>
    </div>
  )
}

export default SignupPage