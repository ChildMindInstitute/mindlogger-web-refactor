import { useState } from "react"

import { TERMS_URL } from "../lib/constants"
import { useSignupTranslation } from "../lib/useSignupTranslation"
import { SignupFormSchema, TSignupForm } from "../model/signup.schema"

import { useSignupMutation } from "~/entities/user"
import { Input, Checkbox, BasicButton, BasicFormProvider, DisplaySystemMessage, PasswordIcon } from "~/shared/ui"
import { isObjectEmpty, useCustomForm, usePasswordType } from "~/shared/utils"

export const SignupForm = () => {
  const { t } = useSignupTranslation()
  const [passwordType, onPasswordIconClick] = usePasswordType()
  const [confirmPasswordType, onConfirmPasswordIconClick] = usePasswordType()

  const [terms, setTerms] = useState<boolean>(false)

  const form = useCustomForm(
    { defaultValues: { email: "", firstName: "", lastName: "", password: "", confirmPassword: "" } },
    SignupFormSchema,
  )
  const {
    handleSubmit,
    formState: { errors },
  } = form

  const { mutate: signup, error, isSuccess } = useSignupMutation()

  const onSignupSubmit = (data: TSignupForm) => {
    const { email, password, firstName, lastName } = data
    return signup({ email, password, fullName: `${firstName} ${lastName}` })
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onSignupSubmit)}>
      <Input type="text" name="email" placeholder={t("email") || ""} autoComplete="username" />
      <Input type="text" name="firstName" placeholder={t("firstName") || ""} />
      <Input type="text" name="lastName" placeholder={t("lastName") || ""} />
      <Input
        type={passwordType}
        name="password"
        placeholder={t("password") || ""}
        autoComplete="new-password"
        Icon={<PasswordIcon isSecure={passwordType === "password"} onClick={onPasswordIconClick} />}
      />
      <Input
        type={confirmPasswordType}
        name="confirmPassword"
        placeholder={t("confirmPassword") || ""}
        autoComplete="new-password"
        Icon={<PasswordIcon isSecure={confirmPasswordType === "password"} onClick={onConfirmPasswordIconClick} />}
      />

      <div className="d-flex mb-3">
        <Checkbox uniqId="terms" onChange={() => setTerms(prev => !prev)}>
          I agree to the{" "}
          <a href={TERMS_URL} target="_blank" rel="noreferrer">
            Terms of Service
          </a>
        </Checkbox>
      </div>

      <DisplaySystemMessage
        errorMessage={error?.response?.data?.message}
        successMessage={isSuccess ? t("success") : null}
      />

      <BasicButton type="submit" variant="primary" disabled={!isObjectEmpty(errors) || !terms} defaultSize>
        {t("title")}
      </BasicButton>
    </BasicFormProvider>
  )
}
