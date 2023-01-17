import classNames from "classnames"
import { Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { LoginSchema, TLoginForm } from "../model/login.schema"

import {
  AuthSchema,
  ILoginPayload,
  SuccessGetUserResponse,
  SuccessLoginResponse,
  useAuth,
  useGetUserMutation,
  useLoginMutation,
  UserStoreSchema,
} from "~/entities/user"
import { BasicButton, BasicFormProvider, Input, DisplaySystemMessage, PasswordIcon } from "~/shared/ui"
import { ROUTES, useCustomForm, usePasswordType } from "~/shared/utils"

export const LoginForm = () => {
  const { t } = useLoginTranslation()
  const navigate = useNavigate()

  const { setAuth, setUser } = useAuth()
  const [passwordType, onPasswordIconClick] = usePasswordType()

  const form = useCustomForm({ defaultValues: { email: "", password: "" } }, LoginSchema)
  const {
    handleSubmit,
    formState: { isValid },
  } = form

  const onGetUserSuccess = ({ data }: SuccessGetUserResponse) => {
    const { result } = data
    const parsedUser = UserStoreSchema.parse(result)
    setUser(parsedUser)
    navigate(ROUTES.dashboard.path)
  }

  const { mutate: getUser } = useGetUserMutation({ onSuccess: onGetUserSuccess })

  const onLoginSuccess = ({ data }: SuccessLoginResponse) => {
    const { result } = data
    const parsedAuthUser = AuthSchema.parse(result)
    setAuth(parsedAuthUser)

    if (parsedAuthUser.accessToken) {
      getUser(parsedAuthUser.accessToken)
    }
  }

  const {
    mutate: login,
    isLoading,
    error,
  } = useLoginMutation({
    onSuccess: onLoginSuccess,
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
