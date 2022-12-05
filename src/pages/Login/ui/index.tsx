import { Alert, Container } from "react-bootstrap"
import { Controller } from "react-hook-form"
import { Link } from "react-router-dom"

import AppStore from "~/assets/Appstore.svg"
import GooglePlay from "~/assets/GooglePlay.svg"

import { ROUTES } from "~/app/system/routes/constants"
import BasicForm from "~/shared/ui/Form"
import Input from "~/shared/ui/Input"
import BasicButton from "~/shared/ui/Button"

import { useCustomForm } from "~/utils/hooks/useCustomForm"
import { isObjectEmpty } from "~/utils/object"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { APPSTORE_LINK, GOOGLEPLAY_LINK } from "../lib/constants"
import { LoginSchema, TLoginForm } from "../model"

import "./login.scss"

const LoginPage = () => {
  const { t } = useLoginTranslation()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useCustomForm({ defaultValues: { email: "", password: "" } }, { schema: LoginSchema })

  const onLoginSubmit = (data: TLoginForm) => {
    console.log(data) // TODO: Remove console.log and implement real logic
  }

  return (
    <div className="demo mp-3 align-self-start w-100">
      <div id="login" className="text-center my-2 px-3">
        <Container>
          <h1 className="title-label">{t("welcomeMessage")}</h1>
          <h1 className="title-label">{t("appType")}</h1>
        </Container>

        <Container id="loginForm">
          <BasicForm onSubmit={handleSubmit(onLoginSubmit)}>
            {!isObjectEmpty(errors) && (
              <Alert variant="danger">{errors?.email?.message || errors?.password?.message}</Alert>
            )}

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} type="text" placeholder={t("email") || ""} className="mb-3" autoComplete="username" />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder={t("password") || ""}
                  className="mb-3"
                  autoComplete="current-password"
                />
              )}
            />

            <Container className="d-flex justify-content-start p-0 mb-3">
              <BasicButton type="submit" variant="link" className="p-0">
                <Link to={ROUTES.forgotPassword.path} relative="path">
                  {t("forgotPassword")}
                </Link>
              </BasicButton>
            </Container>

            <Container>
              <BasicButton type="submit" variant="primary">
                {t("button")}
              </BasicButton>
            </Container>
          </BasicForm>

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
              <img src={AppStore} alt="" />
            </a>
            <a href={GOOGLEPLAY_LINK} target="_blank" rel="noreferrer">
              <img src={GooglePlay} alt="" />
            </a>
          </Container>
        </Container>
      </div>
    </div>
  )
}

export default LoginPage
