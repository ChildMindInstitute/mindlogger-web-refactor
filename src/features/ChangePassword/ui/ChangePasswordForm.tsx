import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import classNames from "classnames"
import { Container } from "react-bootstrap"

import { useChangePasswordTranslation } from "../lib/useChangePasswordTranslation"
import { ChangePasswordSchema, TChangePassword } from "../model/schema"

import { useUpdatePasswordMutation } from "~/entities/user"
import { Theme } from "~/shared/constants"
import { BasicFormProvider, DisplaySystemMessage, Input, PasswordIcon } from "~/shared/ui"
import { useCustomForm, usePasswordType } from "~/shared/utils"

import "./style.scss"

interface ChangePasswordFormProps {
  title?: string | null
}

export const ChangePasswordForm = ({ title }: ChangePasswordFormProps) => {
  const { t } = useChangePasswordTranslation()

  const [oldPasswordType, onOldPasswordIconClick] = usePasswordType()
  const [newPasswordType, onNewPasswordIconClick] = usePasswordType()
  const [confirmNewPasswordType, onConfirmNewPasswordIconClick] = usePasswordType()

  const form = useCustomForm({ defaultValues: { old: "", new: "", confirm: "" } }, ChangePasswordSchema)
  const { handleSubmit, reset } = form

  const {
    mutate: updatePassword,
    error,
    isLoading,
    isSuccess,
  } = useUpdatePasswordMutation({
    onSuccess() {
      reset()
    },
  })

  const onSubmit = (data: TChangePassword) => {
    return updatePassword({ password: data.new, prev_password: data.old })
  }

  return (
    <Container className={classNames("change-password-form-container")}>
      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Container className={classNames("overflow-hidden")}>
          <p>{title}</p>
        </Container>

        <Input
          id="change-password-form-old-password"
          type={oldPasswordType}
          name="old"
          placeholder={t("oldPassword") || ""}
          autoComplete="current-password"
          Icon={<PasswordIcon isSecure={oldPasswordType === "password"} onClick={onOldPasswordIconClick} />}
        />
        <Input
          id="change-password-form-new-password"
          type={newPasswordType}
          name="new"
          placeholder={t("newPassword") || ""}
          autoComplete="new-password"
          Icon={<PasswordIcon isSecure={newPasswordType === "password"} onClick={onNewPasswordIconClick} />}
        />
        <Input
          id="change-password-form-confirm-password"
          type={confirmNewPasswordType}
          name="confirm"
          placeholder={t("confirmPassword") || ""}
          autoComplete="new-password"
          Icon={
            <PasswordIcon isSecure={confirmNewPasswordType === "password"} onClick={onConfirmNewPasswordIconClick} />
          }
        />

        <DisplaySystemMessage errorMessage={error?.evaluatedMessage} successMessage={isSuccess ? t("success") : null} />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ borderRadius: "100px", maxWidth: "400px", width: "100%", padding: "10px 24px" }}>
          {isLoading ? (
            <CircularProgress size={25} sx={{ color: Theme.colors.light.onPrimary }} />
          ) : (
            <Typography
              fontFamily="Atkinson"
              fontSize="14px"
              fontWeight={700}
              fontStyle="normal"
              lineHeight="20px"
              letterSpacing="0.1px"
              textTransform="none">
              {t("submit")}
            </Typography>
          )}
        </Button>
      </BasicFormProvider>
    </Container>
  )
}
