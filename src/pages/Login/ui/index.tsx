import { Alert, Container } from "react-bootstrap"
import { Controller } from "react-hook-form"

import BasicForm from "~/shared/Form"
import Input from "~/shared/Input"
import BasicButton from "~/shared/Button"

import { useCustomForm } from "~/utils/hooks/useCustomForm"
import { isObjectEmpty } from "~/utils/object"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { LoginSchema, TLoginForm } from "../model"

import "./login.scss"
import { Link } from "react-router-dom"
import { ROUTES } from "../../../app/system/routes/constants"

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
    <div className="demo mp-3 align-self-center w-100">
      <div id="login" className="text-center my-2 px-3">
        <h1>{t("title")}</h1>

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

            <BasicButton type="submit" variant="primary">
              {t("title")}
            </BasicButton>
          </BasicForm>

          <p className="mt-3">
            {t("accountMessage")}{" "}
            <Link to={ROUTES.signup.path} relative="path">
              {t("create")}
            </Link>
          </p>
          <p className="mt-3">
            {t("forgotPassword")}{" "}
            <Link to={ROUTES.forgotPassword.path} relative="path">
              {t("reset")}
            </Link>
          </p>
        </Container>
      </div>
    </div>
  )
}

export default LoginPage
