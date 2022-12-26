import { useState } from "react"
import { Alert, Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { AuthSchema, UserStoreSchema, useAuth, SuccessSignupResponse, useSignupMutation } from "~/entities"
import { BasicButton, BasicFormProvider, Input, isObjectEmpty, useCustomForm, Checkbox, ROUTES } from "~/shared"

import { TERMS_URL } from "../lib/constants"
import { useSignupTranslation } from "../lib/useSignupTranslation"

import { SignupFormSchema, TSignupForm } from "../model/signup.schema"

import "./styles.scss"

const SignupPage = () => {
  const { t } = useSignupTranslation()
  const navigate = useNavigate()

  const { setUserAndAuth } = useAuth()
  const [terms, setTerms] = useState<boolean>(false)

  const form = useCustomForm(
    { defaultValues: { email: "", firstName: "", lastName: "", password: "", confirmPassword: "" } },
    SignupFormSchema,
  )
  const {
    handleSubmit,
    formState: { errors },
  } = form

  const onSuccess = ({ data }: SuccessSignupResponse) => {
    const { account, authToken, ...rest } = data

    const parsedUser = UserStoreSchema.parse(rest)
    const parsedAuth = AuthSchema.parse(authToken)
    setUserAndAuth(parsedUser, parsedAuth)
    navigate(ROUTES.dashboard.path)
  }

  const {
    mutate: signup,
    isError,
    error,
  } = useSignupMutation({
    onSuccess,
  })

  const onSignupSubmit = (data: TSignupForm) => {
    signup(data)
  }

  return (
    <div className="signupPageContainer align-self-start pt-5 mb-3 w-100">
      <div className="signup text-center my-2">
        <h1>{t("title")}</h1>

        <Container className="signupForm">
          <BasicFormProvider {...form} onSubmit={handleSubmit(onSignupSubmit)}>
            {!isObjectEmpty(errors) && (
              <Alert variant="danger">
                {errors?.email?.message || errors?.password?.message || errors?.confirmPassword?.message}
              </Alert>
            )}

            {isError && !isObjectEmpty(error?.response?.data) && (
              <Alert variant="danger">{error?.response?.data?.message}</Alert>
            )}

            <Input type="text" name="email" placeholder={t("email") || ""} autoComplete="username" />
            <Input type="text" name="firstName" placeholder={t("firstName") || ""} />
            <Input type="text" name="lastName" placeholder={t("lastName") || ""} />

            <Input type="password" name="password" placeholder={t("password") || ""} autoComplete="new-password" />
            <Input
              type="password"
              name="confirmPassword"
              placeholder={t("confirmPassword") || ""}
              autoComplete="new-password"
            />

            <div className="d-flex mb-3">
              <Checkbox uniqId="terms" onChange={() => setTerms(prev => !prev)}>
                I agree to the{" "}
                <a href={TERMS_URL} target="_blank" rel="noreferrer">
                  Terms of Service
                </a>
              </Checkbox>
            </div>

            <BasicButton type="submit" variant="primary" disabled={!isObjectEmpty(errors) || !terms}>
              {t("title")}
            </BasicButton>
          </BasicFormProvider>

          <p className="my-3">
            {t("account")} <Link to="/login"> {t("logIn")}</Link>
          </p>
        </Container>
      </div>
    </div>
  )
}

export default SignupPage
