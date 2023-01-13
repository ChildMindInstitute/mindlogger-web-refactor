import classNames from "classnames"
import { Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { LoginSchema, TLoginForm } from "../model/login.schema"

import {
  AuthSchema,
  ILoginPayload,
  SuccessLoginResponse,
  useAuth,
  useLoginMutation,
  UserStoreSchema,
} from "~/entities/user"
import { BasicButton, BasicFormProvider, Input, DisplaySystemMessage, PasswordIcon } from "~/shared/ui"
import { ROUTES, useCustomForm, usePasswordType } from "~/shared/utils"

export const LoginForm = () => {
  const { t } = useLoginTranslation()
  const navigate = useNavigate()

  const [passwordType, onPasswordIconClick] = usePasswordType()

  const { setUserAndAuth } = useAuth()
  const form = useCustomForm({ defaultValues: { email: "", password: "" } }, LoginSchema)
  const {
    handleSubmit,
    formState: { isValid },
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
    error,
  } = useLoginMutation({
    onSuccess,
  })

  const onLoginSubmit = (data: TLoginForm) => {
    login(data as ILoginPayload)
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onLoginSubmit)}>
      <Input type="text" name="email" placeholder={t("email") || ""} autoComplete="username" />
      <Input
        type={passwordType}
        name="password"
        placeholder={t("password") || ""}
        autoComplete="current-password"
        Icon={<PasswordIcon isSecure={passwordType === "password"} onClick={onPasswordIconClick} />}
      />

      <Container className="d-flex justify-content-start p-0 mb-3">
        <BasicButton type="button" variant="link" className={classNames("p-0", "ms-3")}>
          <Link to={ROUTES.forgotPassword.path} relative="path">
            {t("forgotPassword")}
          </Link>
        </BasicButton>
      </Container>

      <DisplaySystemMessage errorMessage={error?.response?.data?.message} />

      <Container>
        <BasicButton type="submit" variant="primary" disabled={!isValid || isLoading} loading={isLoading} defaultSize>
          {t("button")}
        </BasicButton>
      </Container>
    </BasicFormProvider>
  )
}
