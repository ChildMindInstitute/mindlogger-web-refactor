import classNames from "classnames"
import { Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { LoginSchema, TLoginForm } from "../model/login.schema"

import { ILoginPayload, useLoginMutation, userModel } from "~/entities/user"
import { BasicButton, BasicFormProvider, Input, DisplaySystemMessage, PasswordIcon } from "~/shared/ui"
import { ROUTES, useCustomForm, usePasswordType } from "~/shared/utils"

export const LoginForm = () => {
  const { t } = useLoginTranslation()
  const navigate = useNavigate()

  const [passwordType, onPasswordIconClick] = usePasswordType()

  const { setUser } = userModel.hooks.useUserState()

  const form = useCustomForm({ defaultValues: { email: "", password: "" } }, LoginSchema)
  const {
    handleSubmit,
    formState: { isValid },
  } = form

  const {
    mutate: login,
    isLoading,
    error,
  } = useLoginMutation({
    onSuccess(data) {
      setUser(data.data.result.user)

      userModel.secureTokensStorage.setTokens(data.data.result.token)
      navigate(ROUTES.dashboard.path)
    },
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

      <DisplaySystemMessage errorMessage={error?.evaluatedMessage} />

      <Container>
        <BasicButton type="submit" variant="primary" disabled={!isValid || isLoading} loading={isLoading} defaultSize>
          {t("button")}
        </BasicButton>
      </Container>
    </BasicFormProvider>
  )
}
