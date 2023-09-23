import { useState } from "react"

import Box from "@mui/material/Box"
import { useNavigate } from "react-router-dom"

import { TERMS_URL } from "../lib/constants"
import { useSignupTranslation } from "../lib/useSignupTranslation"
import { SignupFormSchema, TSignupForm } from "../model/signup.schema"

import { useNotification } from "~/entities/notification"
import { useLoginMutation, userModel, useSignupMutation } from "~/entities/user"
import { Input, Checkbox, BasicFormProvider, PasswordIcon, BaseButton } from "~/shared/ui"
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

  const { showErrorNotification, showSuccessNotification } = useNotification()

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

  const { mutate: signup, isLoading } = useSignupMutation({
    onSuccess() {
      showSuccessNotification(t("success"))
      if (locationState?.isInvitationFlow) {
        const { email, password } = form.getValues()
        login({ email, password })
      }

      reset()
    },
    onError(error) {
      if (error.evaluatedMessage) {
        showErrorNotification(error.evaluatedMessage)
      }
    },
  })

  const onSignupSubmit = (data: TSignupForm) => {
    if (!terms) {
      return showErrorNotification(t("pleaseAgreeTerms"))
    }

    return signup(data)
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onSignupSubmit)}>
      <Box display="flex" flexDirection="column" gap="24px">
        <Input id="signup-form-email" type="text" name="email" placeholder={t("email") || ""} autoComplete="username" />
        <Input id="signup-form-firstname" type="text" name="firstName" placeholder={t("firstName") || ""} />
        <Input id="signup-form-lastname" type="text" name="lastName" placeholder={t("lastName") || ""} />
        <Input
          id="signup-form-new-password"
          type={passwordType}
          name="password"
          placeholder={t("password") || ""}
          autoComplete="new-password"
          Icon={<PasswordIcon isSecure={passwordType === "password"} onClick={onPasswordIconClick} />}
        />
        <Input
          id="signup-form-confirm-password"
          type={confirmPasswordType}
          name="confirmPassword"
          placeholder={t("confirmPassword") || ""}
          autoComplete="new-password"
          Icon={<PasswordIcon isSecure={confirmPasswordType === "password"} onClick={onConfirmPasswordIconClick} />}
        />

        <Box display="flex" justifyContent="center">
          <Checkbox uniqId="terms" onChange={() => setTerms(prev => !prev)}>
            I agree to the{" "}
            <a href={TERMS_URL} target="_blank" rel="noreferrer">
              Terms of Service
            </a>
          </Checkbox>
        </Box>

        <BaseButton type="submit" variant="contained" text={t("create")} isLoading={isLoading} />
      </Box>
    </BasicFormProvider>
  )
}
