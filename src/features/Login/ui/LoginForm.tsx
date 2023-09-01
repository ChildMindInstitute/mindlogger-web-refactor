import classNames from "classnames"
import { Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { LoginSchema, TLoginForm } from "../model/login.schema"

import { ILoginPayload, useLoginMutation, userModel } from "~/entities/user"
import { ROUTES } from "~/shared/constants"
import { BasicButton, BasicFormProvider, Input, DisplaySystemMessage, PasswordIcon } from "~/shared/ui"
import {
  secureTokensStorage,
  secureUserPrivateKeyStorage,
  useCustomForm,
  useEncryption,
  usePasswordType,
} from "~/shared/utils"

interface LoginFormProps {
  locationState?: Record<string, unknown>
}

export const LoginForm = ({ locationState }: LoginFormProps) => {
  const { t } = useLoginTranslation()
  const navigate = useNavigate()

  const [passwordType, onPasswordIconClick] = usePasswordType()

  const { setUser } = userModel.hooks.useUserState()
  const { generateUserPrivateKey } = useEncryption()

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
    onSuccess(data, variables) {
      const userParams = {
        userId: data.data.result.user.id,
        email: data.data.result.user.email,
        password: variables.password,
      }

      const userPrivateKey = generateUserPrivateKey(userParams)
      secureUserPrivateKeyStorage.setUserPrivateKey(userPrivateKey)

      setUser(data.data.result.user)
      secureTokensStorage.setTokens(data.data.result.token)

      if (locationState?.isInvitationFlow) {
        navigate(locationState.backRedirectPath as string)
      } else {
        navigate(ROUTES.appletList.path)
      }
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
        <BasicButton
          className={classNames("mt-3")}
          type="submit"
          variant="primary"
          disabled={!isValid || isLoading}
          loading={isLoading}
          defaultSize>
          {t("button")}
        </BasicButton>
      </Container>
    </BasicFormProvider>
  )
}
