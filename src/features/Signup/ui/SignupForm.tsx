import { useState } from "react"

import { useNavigate } from "react-router-dom"

import { TERMS_URL } from "../lib/constants"
import { useSignupTranslation } from "../lib/useSignupTranslation"
import { SignupFormSchema, TSignupForm } from "../model/signup.schema"

import { AuthSchema, SuccessSignupResponse, useAuth, UserStoreSchema, useSignupMutation } from "~/entities/user"
import { Input, Checkbox, BasicButton, BasicFormProvider, DisplaySystemMessage } from "~/shared/ui"
import { isObjectEmpty, useCustomForm, ROUTES, usePasswordInput } from "~/shared/utils"

export const SignupForm = () => {
  const navigate = useNavigate()
  const { t } = useSignupTranslation()
  const [isPasswordType, onPasswordIconClick, PasswordIcon] = usePasswordInput()
  const [isConfirmPasswordType, onConfirmPasswordIconClick, ConfirmPasswordIcon] = usePasswordInput()

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
    return navigate(ROUTES.dashboard.path)
  }

  const { mutate: signup, error } = useSignupMutation({
    onSuccess,
  })

  const onSignupSubmit = (data: TSignupForm) => {
    return signup(data)
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onSignupSubmit)}>
      <Input type="text" name="email" placeholder={t("email") || ""} autoComplete="username" />
      <Input type="text" name="firstName" placeholder={t("firstName") || ""} />
      <Input type="text" name="lastName" placeholder={t("lastName") || ""} />
      <Input
        type={isPasswordType}
        name="password"
        placeholder={t("password") || ""}
        autoComplete="new-password"
        onIconClick={onPasswordIconClick}
        Icon={PasswordIcon}
      />
      <Input
        type={isConfirmPasswordType}
        name="confirmPassword"
        placeholder={t("confirmPassword") || ""}
        autoComplete="new-password"
        onIconClick={onConfirmPasswordIconClick}
        Icon={ConfirmPasswordIcon}
      />

      <div className="d-flex mb-3">
        <Checkbox uniqId="terms" onChange={() => setTerms(prev => !prev)}>
          I agree to the{" "}
          <a href={TERMS_URL} target="_blank" rel="noreferrer">
            Terms of Service
          </a>
        </Checkbox>
      </div>

      <DisplaySystemMessage errorMessage={error?.response?.data?.message} />

      <BasicButton type="submit" variant="primary" disabled={!isObjectEmpty(errors) || !terms} defaultSize>
        {t("title")}
      </BasicButton>
    </BasicFormProvider>
  )
}
