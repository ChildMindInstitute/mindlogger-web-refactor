import { useState } from "react"

import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { TERMS_URL } from "../lib/constants"
import { useSignupTranslation } from "../lib/useSignupTranslation"
import { SignupFormSchema, TSignupForm } from "../model/signup.schema"

import { useLoginMutation, userModel, useSignupMutation } from "~/entities/user"
import { Input, Checkbox, BasicButton, BasicFormProvider, DisplaySystemMessage, PasswordIcon } from "~/shared/ui"
import {
  secureTokensStorage,
  secureUserPrivateKeyStorage,
  useCustomForm,
  useEncryption,
  usePasswordType,
} from "~/shared/utils"

interface SignupFormProps {
  locationState?: Record<string, unknown>
}

export const SignupForm = ({ locationState }: SignupFormProps) => {
  const { t } = useSignupTranslation()
  const navigate = useNavigate()

  const [passwordType, onPasswordIconClick] = usePasswordType()
  const [confirmPasswordType, onConfirmPasswordIconClick] = usePasswordType()

  const [terms, setTerms] = useState<boolean>(false)
  const { setUser } = userModel.hooks.useUserState()

  const form = useCustomForm(
    { defaultValues: { email: "", firstName: "", lastName: "", password: "", confirmPassword: "" } },
    SignupFormSchema,
  )
  const { handleSubmit, reset } = form
  const { generateUserPrivateKey } = useEncryption()

  const { mutate: login } = useLoginMutation({
    onSuccess(data, variables) {
      const { user, token } = data.data.result

      const userParams = {
        userId: data.data.result.user.id,
        email: data.data.result.user.email,
        password: variables.password,
      }

      const userPrivateKey = generateUserPrivateKey(userParams)
      secureUserPrivateKeyStorage.setUserPrivateKey(userPrivateKey)

      setUser(user)
      secureTokensStorage.setTokens(token)

      return navigate(locationState?.backRedirectPath as string)
    },
  })

  const {
    mutate: signup,
    error,
    isSuccess,
    isLoading,
  } = useSignupMutation({
    onSuccess() {
      if (locationState?.isInvitationFlow) {
        const { email, password } = form.getValues()
        login({ email, password })
      }

      reset()
    },
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

      <DisplaySystemMessage errorMessage={error?.evaluatedMessage} successMessage={isSuccess ? t("success") : null} />

      <BasicButton
        className={classNames("mt-3")}
        type="submit"
        variant="primary"
        disabled={!terms || isLoading}
        defaultSize
        loading={isLoading}>
        {t("create")}
      </BasicButton>
    </BasicFormProvider>
  )
}
