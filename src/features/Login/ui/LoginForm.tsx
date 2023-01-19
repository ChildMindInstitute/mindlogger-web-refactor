import classNames from "classnames"
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { LoginSchema, TLoginForm } from "../model/login.schema"

import { ILoginPayload, useLoginMutation } from "~/entities/user"
import { BasicButton, BasicFormProvider, Input, DisplaySystemMessage, PasswordIcon } from "~/shared/ui"
import { ROUTES, useCustomForm, usePasswordType } from "~/shared/utils"

export const LoginForm = () => {
  const { t } = useLoginTranslation()

  const [passwordType, onPasswordIconClick] = usePasswordType()

  const form = useCustomForm({ defaultValues: { email: "", password: "" } }, LoginSchema)
  const {
    handleSubmit,
    formState: { isValid },
  } = form

  const { mutate: login, isLoading, error } = useLoginMutation()

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
