import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"

import { BasicButton } from "~/shared/ui"
import { ROUTES } from "~/shared/utils"

import { ForgotPasswordForm, useForgotPasswordTranslation } from "~/features/ForgotPassword"

import "./style.scss"

const ForgotPassword = () => {
  const { t } = useForgotPasswordTranslation()

  return (
    <div className="forgotPassowrdPageContainer mp-3 align-self-start align-items-start w-100">
      <div className="forgotPassword text-center my-2 px-3 pt-5">
        <h1>{t("title")}</h1>

        <Container className="loginForm">
          <ForgotPasswordForm />

          <Container className="d-flex justify-content-center p-0 mb-3">
            {t("rememberPassword")}
            <BasicButton type="button" variant="link" className="p-0 ms-1 login-link">
              <Link to={ROUTES.login.path} relative="path" className="login-link">
                {t("logIn")}
              </Link>
            </BasicButton>
          </Container>
        </Container>
      </div>
    </div>
  )
}

export default ForgotPassword
