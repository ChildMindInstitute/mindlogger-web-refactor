import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { BasicButton, BasicFormProvider, Input, ROUTES, useCustomForm } from "~/shared"

import { useForgotPasswordTranslation } from "../lib/useForgotPasswordTranslation"
import { ForgotPasswordForm, ForgotPasswordSchema } from "../model/schemas"

import "./style.scss"

const ForgotPassword = () => {
  const { t } = useForgotPasswordTranslation()
  const form = useCustomForm({ defaultValues: { email: "" } }, ForgotPasswordSchema)

  const onForgotPasswordSubmit = (data: ForgotPasswordForm) => {
    console.log(data)
  }

  const { handleSubmit } = form

  return (
    <div className="forgotPassowrdPageContainer mp-3 align-self-start align-items-start w-100">
      <div className="forgotPassword text-center my-2 px-3 pt-5">
        <h1>{t("title")}</h1>

        <Container className="loginForm">
          <BasicFormProvider {...form} onSubmit={handleSubmit(onForgotPasswordSubmit)}>
            <Input type="text" name="email" placeholder={t("email") || ""} autoComplete="username" />

            <Container>
              <BasicButton type="submit" variant="primary">
                {t("submit")}
              </BasicButton>
            </Container>
          </BasicFormProvider>

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
