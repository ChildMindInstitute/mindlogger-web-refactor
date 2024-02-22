import Box from "@mui/material/Box"
import { useNavigate } from "react-router-dom"

import { useRecoveryPasswordTranslation } from "../lib/useRecoveryPasswordTranslation"
import { RecoveryPassword, RecoveryPasswordSchema } from "../model/schema"

import { useApproveRecoveryPasswordMutation } from "~/entities/user"
import { ROUTES } from "~/shared/constants"
import { BaseButton, BasicFormProvider, Container, DisplaySystemMessage, Input, PasswordIcon } from "~/shared/ui"
import { useCustomForm, usePasswordType } from "~/shared/utils"

interface RecoveryPasswordFormProps {
  title?: string | null
  token?: string | null
  email?: string | null
}

export const RecoveryPasswordForm = ({ title, token, email }: RecoveryPasswordFormProps) => {
  const navigate = useNavigate()
  const { t } = useRecoveryPasswordTranslation()

  const form = useCustomForm({ defaultValues: { new: "", confirm: "" } }, RecoveryPasswordSchema)
  const { handleSubmit, reset } = form

  const {
    mutate: approveRecoveryPassword,
    isSuccess,
    isLoading,
    error,
    status,
  } = useApproveRecoveryPasswordMutation({
    onSuccess() {
      reset()
    },
  })
  const onSubmit = (data: RecoveryPassword) => {
    if (token && email) {
      return approveRecoveryPassword({ key: token, email, password: data.new })
    }
  }

  const [newPasswordType, onNewPasswordIconClick] = usePasswordType()
  const [confirmNewPasswordType, onConfirmNewPasswordIconClick] = usePasswordType()

  const backToLogin = () => {
    return navigate(ROUTES.login.path)
  }

  return (
    <Container className="change-password-form-container">
      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Box className="overflow-hidden" marginBottom={2}>
          <p>{title}</p>
        </Box>

        <Box display="flex" flex={1} gap={2} flexDirection="column">
          <Input
            id="recovery-password-new-password"
            type={newPasswordType}
            name="new"
            placeholder={t("newPassword") || ""}
            autoComplete="new-password"
            Icon={<PasswordIcon isSecure={newPasswordType === "password"} onClick={onNewPasswordIconClick} />}
          />
          <Input
            id="recovery-password-confirm-new-password"
            type={confirmNewPasswordType}
            name="confirm"
            placeholder={t("confirmPassword") || ""}
            autoComplete="new-password"
            Icon={
              <PasswordIcon isSecure={confirmNewPasswordType === "password"} onClick={onConfirmNewPasswordIconClick} />
            }
          />
        </Box>

        <DisplaySystemMessage errorMessage={error?.evaluatedMessage} successMessage={isSuccess ? t("success") : null} />

        {status === "success" && (
          <Box marginY={3}>
            <BaseButton
              type="button"
              onClick={backToLogin}
              variant="contained"
              isLoading={isLoading}
              text={t("backToLogin")}
            />
          </Box>
        )}

        {status !== "success" && (
          <Box marginY={3}>
            <BaseButton type="submit" variant="contained" isLoading={isLoading} text={t("submit")} />
          </Box>
        )}
      </BasicFormProvider>
    </Container>
  )
}
