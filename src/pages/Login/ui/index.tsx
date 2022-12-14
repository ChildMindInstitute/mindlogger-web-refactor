import { Alert, Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import AppStore from "~/assets/Appstore.svg"
import GooglePlay from "~/assets/GooglePlay.svg"

import { useAppDispatch } from "~/app/store"
import { ROUTES } from "~/app/system/routes/constants"
import { Input, BasicButton, BasicFormProvider } from "~/shared/ui/"

import { UserStateSchema, setUser, AuthSchema, setAuth } from "~/entities"
import { useCustomForm } from "~/utils/hooks/useCustomForm"
import { isObjectEmpty } from "~/utils/object"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { APPSTORE_LINK, GOOGLEPLAY_LINK } from "../lib/constants"
import { ResponseData, useFetchAuthorization } from "../lib/api"
import { LoginSchema, TLoginForm } from "../model"

import "./login.scss"

const LoginPage = () => {
  const { t } = useLoginTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const form = useCustomForm({ defaultValues: { email: "", password: "" } }, LoginSchema)
  const {
    handleSubmit,
    formState: { errors },
  } = form

  const onSuccess = ({ data }: ResponseData) => {
    const { user, authToken } = data
    const parsedUser = UserStateSchema.parse(user)
    const parsedAuthUser = AuthSchema.parse(authToken)
    dispatch(setUser(parsedUser))
    dispatch(setAuth(parsedAuthUser))
    navigate(ROUTES.dashboard.path)
  }

  const mutation = useFetchAuthorization({
    onSuccess,
  })

  const onLoginSubmit = (data: TLoginForm) => {
    mutation.mutate(data)
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
              <BasicButton
                type="submit"
                variant="primary"
                disabled={!isObjectEmpty(errors) || mutation.isLoading}
                loading={mutation.isLoading}>
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
