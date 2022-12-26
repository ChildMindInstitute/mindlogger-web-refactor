import { Alert, Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { BasicButton, BasicFormProvider, Input, isObjectEmpty, ROUTES, useCustomForm } from "~/shared"
import { useForgotPasswordMutation } from "~/entities"

import { useForgotPasswordTranslation } from "../lib/useForgotPasswordTranslation"
import { ForgotPasswordForm, ForgotPasswordSchema } from "../model/schemas"

import "./style.scss"

const ForgotPassword = () => {
  const { t } = useForgotPasswordTranslation()
  const navigate = useNavigate()

  const form = useCustomForm({ defaultValues: { email: "" } }, ForgotPasswordSchema)

  const onSuccess = () => {
    navigate(ROUTES.login.path)
  }

  const { mutate: forgotPassword, error, isError, isLoading } = useForgotPasswordMutation({ onSuccess })

  const onForgotPasswordSubmit = (data: ForgotPasswordForm) => {
    forgotPassword(data)
  }

  const {
    handleSubmit,
    formState: { errors: validationErrors, isValid },
  } = form

  return (
    <div className="forgotPassowrdPageContainer mp-3 align-self-start align-items-start w-100">
      <div className="forgotPassword text-center my-2 px-3 pt-5">
        <h1>{t("title")}</h1>

        <Container className="loginForm">
          <BasicFormProvider {...form} onSubmit={handleSubmit(onForgotPasswordSubmit)}>
            {!isValid && !isObjectEmpty(validationErrors) && (
              <Alert variant="danger">{validationErrors?.email?.message}</Alert>
            )}

            {isError && !isObjectEmpty(error?.response?.data) && (
              <Alert variant="danger">{error?.response?.data?.message}</Alert>
            )}

            <Input type="text" name="email" placeholder={t("email") || ""} autoComplete="username" />

            <Container>
              <BasicButton type="submit" variant="primary" disabled={!isValid || isLoading} loading={isLoading}>
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
