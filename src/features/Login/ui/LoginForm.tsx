import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Link, useNavigate } from "react-router-dom"

import { useLoginTranslation } from "../lib/useLoginTranslation"
import { LoginSchema, TLoginForm } from "../model/login.schema"

import { ILoginPayload, useLoginMutation, userModel } from "~/entities/user"
import { ROUTES, Theme } from "~/shared/constants"
import { BaseButton, BasicFormProvider, Input, PasswordIcon, useNotification } from "~/shared/ui"
import {
  secureTokensStorage,
  secureUserPrivateKeyStorage,
  useCustomForm,
  useEncryption,
  usePasswordType,
} from "~/shared/utils"

interface LoginFormProps {
  locationState?: Record<string, unknown>
}

export const LoginForm = ({ locationState }: LoginFormProps) => {
  const { t } = useLoginTranslation()
  const navigate = useNavigate()

  const { showErrorNotification } = useNotification()

  const [passwordType, onPasswordIconClick] = usePasswordType()

  const { setUser } = userModel.hooks.useUserState()
  const { generateUserPrivateKey } = useEncryption()

  const form = useCustomForm({ defaultValues: { email: "", password: "" } }, LoginSchema)
  const { handleSubmit } = form

  const { mutate: login, isLoading } = useLoginMutation({
    onSuccess(data, variables) {
      const userParams = {
        userId: data.data.result.user.id,
        email: data.data.result.user.email,
        password: variables.password,
      }

      const userPrivateKey = generateUserPrivateKey(userParams)
      secureUserPrivateKeyStorage.setUserPrivateKey(userPrivateKey)

      setUser(data.data.result.user)
      secureTokensStorage.setTokens(data.data.result.token)

      if (locationState?.isInvitationFlow) {
        navigate(locationState.backRedirectPath as string)
      } else {
        navigate(ROUTES.appletList.path)
      }
    },
    onError(error) {
      if (error.evaluatedMessage) {
        showErrorNotification(error.evaluatedMessage)
      }
    },
  })

  const onLoginSubmit = (data: TLoginForm) => {
    login(data as ILoginPayload)
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onLoginSubmit)}>
      <Box display="flex" flex={1} flexDirection="column" gap="24px">
        <Input
          id="login-form-email-input"
          type="text"
          name="email"
          placeholder={t("email") || ""}
          autoComplete="username"
        />
        <Input
          id="login-form-password-input"
          type={passwordType}
          name="password"
          placeholder={t("password") || ""}
          autoComplete="current-password"
          Icon={<PasswordIcon isSecure={passwordType === "password"} onClick={onPasswordIconClick} />}
        />

        <Box display="flex" justifyContent="center">
          <Link to={ROUTES.forgotPassword.path} relative="path">
            <Typography
              color={Theme.colors.light.primary}
              fontFamily="Atkinson"
              fontSize="14px"
              fontWeight={400}
              fontStyle="normal"
              lineHeight="20px"
              letterSpacing="0.1px"
              sx={{ textDecoration: "underline" }}>
              {t("forgotPassword")}
            </Typography>
          </Link>
        </Box>

        <BaseButton type="submit" variant="contained" isLoading={isLoading} text={t("button")} />
      </Box>
    </BasicFormProvider>
  )
}
