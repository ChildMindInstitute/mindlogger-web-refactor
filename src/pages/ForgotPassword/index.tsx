import { Container } from "react-bootstrap"

import { ForgotPasswordForm, useForgotPasswordTranslation } from "~/features/ForgotPassword"

import "./style.scss"

export const ForgotPasswordPage = () => {
  const { t } = useForgotPasswordTranslation()

  return (
    <div className="forgotPassowrdPageContainer mp-3 align-self-start align-items-start w-100">
      <div className="forgotPassword text-center my-2 px-3 pt-5">
        <h1>{t("title")}</h1>

        <Container className="loginForm">
          <ForgotPasswordForm />
        </Container>
      </div>
    </div>
  )
}
