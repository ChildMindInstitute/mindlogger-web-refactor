import { Alert, Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { AuthSchema, ILoginPayload, SuccessLoginResponse, useAuth, useLoginMutation, UserStoreSchema } from "~/entities"
import { BasicButton, BasicFormProvider, Input, isObjectEmpty, ROUTES, useCustomForm } from "~/shared"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { LoginSchema, TLoginForm } from "../model/login.schema"

export const LoginForm = () => {
  const { t } = useLoginTranslation()
  const navigate = useNavigate()

  const { setUserAndAuth } = useAuth()
  const form = useCustomForm({ defaultValues: { email: "", password: "" } }, LoginSchema)
  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form

  const onSuccess = ({ data }: SuccessLoginResponse) => {
    const { user, authToken } = data
    const parsedUser = UserStoreSchema.parse(user)
    const parsedAuthUser = AuthSchema.parse(authToken)
    setUserAndAuth(parsedUser, parsedAuthUser)
    navigate(ROUTES.dashboard.path)
  }

  const {
    mutate: login,
    isLoading,
    isError,
    error,
  } = useLoginMutation({
    onSuccess,
  })

  const onLoginSubmit = (data: TLoginForm) => {
    login(data as ILoginPayload)
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onLoginSubmit)}>
      {!isObjectEmpty(errors) && <Alert variant="danger">{errors?.email?.message || errors?.password?.message}</Alert>}
      {isError && !isObjectEmpty(error?.response?.data) && (
        <Alert variant="danger">{error.response?.data?.message}</Alert>
      )}

      <Input type="text" name="email" placeholder={t("email") || ""} autoComplete="username" />
      <Input type="password" name="password" placeholder={t("password") || ""} autoComplete="current-password" />

      <Container className="d-flex justify-content-start p-0 mb-3">
        <BasicButton type="button" variant="link" className="p-0">
          <Link to={ROUTES.forgotPassword.path} relative="path">
            {t("forgotPassword")}
          </Link>
        </BasicButton>
      </Container>

      <Container>
        <BasicButton type="submit" variant="primary" disabled={!isValid || isLoading} loading={isLoading}>
          {t("button")}
        </BasicButton>
      </Container>
    </BasicFormProvider>
  )
}
