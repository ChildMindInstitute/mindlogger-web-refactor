import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

import { useRecoveryPasswordTranslation } from "../lib/useRecoveryPasswordTranslation"
import { RecoveryPassword, RecoveryPasswordSchema } from "../model/schema"

import { useApproveRecoveryPasswordMutation } from "~/entities/user"
import { BasicButton, BasicFormProvider, DisplaySystemMessage, Input, PasswordIcon } from "~/shared/ui"
import { ROUTES, useCustomForm, usePasswordType } from "~/shared/utils"

interface RecoveryPasswordFormProps {
  title?: string | null
  token?: string
  email?: string
}

export const RecoveryPasswordForm = ({ title, token, email }: RecoveryPasswordFormProps) => {
  const navigate = useNavigate()
  const { t } = useRecoveryPasswordTranslation()

  const { mutate: approveRecoveryPassword, isSuccess, isLoading, error, status } = useApproveRecoveryPasswordMutation()
  const onSubmit = (data: RecoveryPassword) => {
    if (token && email) {
      return approveRecoveryPassword({ key: token, email, password: data.new })
    }
  }

  const [newPasswordType, onNewPasswordIconClick] = usePasswordType()
  const [confirmNewPasswordType, onConfirmNewPasswordIconClick] = usePasswordType()

  const form = useCustomForm({ defaultValues: { new: "", confirm: "" } }, RecoveryPasswordSchema)
  const { handleSubmit } = form

  const backToLogin = () => {
    return navigate(ROUTES.login.path)
  }

  return (
    <Container className={classNames("change-password-form-container")}>
      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Container className={classNames("overflow-hidden")}>
          <p>{title}</p>
        </Container>

        <Input
          type={newPasswordType}
          name="newPassword"
          placeholder={t("newPassword") || ""}
          autoComplete="new-password"
          Icon={<PasswordIcon isSecure={newPasswordType === "password"} onClick={onNewPasswordIconClick} />}
        />
        <Input
          type={confirmNewPasswordType}
          name="confirmNewPassword"
          placeholder={t("confirmPassword") || ""}
          autoComplete="new-password"
          Icon={
            <PasswordIcon isSecure={confirmNewPasswordType === "password"} onClick={onConfirmNewPasswordIconClick} />
          }
        />

        <DisplaySystemMessage errorMessage={error?.evaluatedMessage} successMessage={isSuccess ? t("success") : null} />

        {status === "success" && (
          <BasicButton
            type="button"
            className={classNames("success-button", "my-3")}
            variant="primary"
            onClick={backToLogin}
            defaultSize>
            {t("backToLogin")}
          </BasicButton>
        )}

        {status !== "success" && (
          <BasicButton
            type="submit"
            className={classNames("success-button", "my-3")}
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            defaultSize>
            {t("submit")}
          </BasicButton>
        )}
      </BasicFormProvider>
    </Container>
  )
}
