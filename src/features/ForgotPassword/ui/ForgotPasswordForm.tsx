import { Alert, Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

import { useForgotPasswordMutation } from "~/entities"
import { BasicButton, BasicFormProvider, Input, isObjectEmpty, ROUTES, useCustomForm } from "~/shared"

import { useForgotPasswordTranslation } from "../lib/useForgotPasswordTranslation"
import { ForgotPasswordSchema, TForgotPasswordForm } from "../model/schemas"

export const ForgotPasswordForm = () => {
  const { t } = useForgotPasswordTranslation()
  const navigate = useNavigate()

  const form = useCustomForm({ defaultValues: { email: "" } }, ForgotPasswordSchema)

  const onSuccess = () => {
    navigate(ROUTES.login.path, { state: { isForgotPasswordSubmittedSuccessfully: true } })
  }

  const { mutate: forgotPassword, error, isError, isLoading } = useForgotPasswordMutation({ onSuccess })

  const onForgotPasswordSubmit = (data: TForgotPasswordForm) => {
    forgotPassword(data)
  }

  const {
    handleSubmit,
    formState: { errors: validationErrors, isValid },
  } = form

  return (
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
  )
}
