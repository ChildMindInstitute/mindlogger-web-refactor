import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"

import { SignupForm, useSignupTranslation } from "~/features/Signup"
import { ROUTES } from "~/shared/utils"

import "./styles.scss"

const SignupPage = () => {
  const { t } = useSignupTranslation()

  return (
    <div className="signupPageContainer align-self-start pt-5 mb-3 w-100">
      <div className="signup text-center my-2">
        <h1>{t("title")}</h1>

        <Container className="signupForm">
          <SignupForm />

          <p className="my-3">
            {t("account")} <Link to={ROUTES.login.path}> {t("logIn")}</Link>
          </p>
        </Container>
      </div>
    </div>
  )
}

export default SignupPage
