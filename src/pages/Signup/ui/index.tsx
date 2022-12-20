import { useState } from "react"
import { Alert, Container } from "react-bootstrap"

import { BasicButton, BasicFormProvider, Input } from "~/shared/ui"
import { useCustomForm } from "~/utils/hooks/useCustomForm"
import Checkbox from "~/shared/ui/Checkbox"
import { isObjectEmpty } from "~/utils/object"

import { TERMS_URL } from "../lib/constants"
import { useSignupTranslation } from "../lib/useSignupTranslation"
import { SignupFormSchema, TSignupForm } from "../model/signup.schema"

import "./styles.scss"
import { Link, useNavigate } from "react-router-dom"
import { TSignupResponseSuccess, useFetchSignup } from "../lib/api"
import { AuthSchema, UserStateSchema } from "../../../entities"
import { useAuth } from "../../../entities/user"
import { ROUTES } from "../../../app/system/routes/constants"

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

  const onSuccess = ({ data }: TSignupResponseSuccess) => {
    const { account, authToken, ...rest } = data

    const parsedUser = UserStateSchema.parse(rest)
    const parsedAuth = AuthSchema.parse(authToken)
    setUserAndAuth(parsedUser, parsedAuth)
    navigate(ROUTES.dashboard.path)
  }

  const mutation = useFetchSignup({
    onSuccess,
  })

  const onSignupSubmit = (data: TSignupForm) => {
    mutation.mutate(data)
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
