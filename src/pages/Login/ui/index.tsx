import { Alert, Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import AppStore from "~/assets/Appstore.svg"
import GooglePlay from "~/assets/GooglePlay.svg"

import { Input, BasicButton, BasicFormProvider, isObjectEmpty, useCustomForm, ROUTES } from "~/shared"
import { AuthSchema, useAuth, UserStoreSchema, useLoginMutation, SuccessLoginResponse, ILoginPayload } from "~/entities"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { APPSTORE_LINK, GOOGLEPLAY_LINK } from "../lib/constants"
import { LoginSchema, TLoginForm } from "../model/login.schema"

import "./login.scss"

const LoginPage = () => {
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

  const { mutate: login, isLoading } = useLoginMutation({
    onSuccess,
  })

  const onLoginSubmit = (data: TLoginForm) => {
    login(data as ILoginPayload)
  }

  return (
    <div className="loginPageContainer mp-3 align-self-start w-100">
      <div className="login text-center my-2 px-3">
        <Container>
          <h1 className="title-label">{t("welcomeMessage")}</h1>
          <h1 className="title-label">{t("appType")}</h1>
        </Container>

        <Container className="loginForm">
          <BasicFormProvider {...form} onSubmit={handleSubmit(onLoginSubmit)}>
            {!isObjectEmpty(errors) && (
              <Alert variant="danger">{errors?.email?.message || errors?.password?.message}</Alert>
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

          <BasicButton type="button" variant="outline-primary" className="mb-3">
            <Link to={ROUTES.signup.path} relative="path">
              {t("create")}
            </Link>
          </BasicButton>
        </Container>

        <Container>
          <Container className="mt-3 mb-2">
            <p>{t("downloadMobile")}</p>
          </Container>
          <Container className="d-flex gap-3 justify-content-center">
            <a href={APPSTORE_LINK} target="_blank" rel="noreferrer">
              <img src={AppStore} alt="App Store Icon" />
            </a>
            <a href={GOOGLEPLAY_LINK} target="_blank" rel="noreferrer">
              <img src={GooglePlay} alt="Google Play Icon" />
            </a>
          </Container>
        </Container>
      </div>
    </div>
  )
}

export default LoginPage
