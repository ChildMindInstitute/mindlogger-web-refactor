import classNames from "classnames"
import { Container } from "react-bootstrap"

import { useChangePasswordTranslation } from "../lib/useChangePasswordTranslation"
import { ChangePasswordSchema, TChangePassword } from "../model/schema"

import { useApproveRecoveryPasswordMutation, useUpdatePasswordMutation } from "~/entities/user"
import { BasicButton, BasicFormProvider, DisplaySystemMessage, Input, PasswordIcon } from "~/shared/ui"
import { useCustomForm, usePasswordType } from "~/shared/utils"

import "./style.scss"

interface ChangePasswordFormProps {
  title?: string | null
  token?: string
  email?: string
  onSuccessExtended?: () => void
}

export const ChangePasswordForm = ({ title, token, email, onSuccessExtended }: ChangePasswordFormProps) => {
  const { t } = useChangePasswordTranslation()

  const [oldPasswordType, onOldPasswordIconClick] = usePasswordType()
  const [newPasswordType, onNewPasswordIconClick] = usePasswordType()
  const [confirmNewPasswordType, onConfirmNewPasswordIconClick] = usePasswordType()

  const form = useCustomForm({ defaultValues: { old: "", new: "", confirm: "" } }, ChangePasswordSchema)
  const { handleSubmit } = form

  const onSuccess = () => {
    if (onSuccessExtended) {
      onSuccessExtended()
    }
  }

  const {
    mutate: updatePassword,
    error: updateError,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useUpdatePasswordMutation()
  const {
    mutate: approveRecoveryPassword,
    isSuccess: isApproveSuccess,
    isLoading: isApproveLoading,
    error: approveError,
  } = useApproveRecoveryPasswordMutation()

  const onSubmit = (data: TChangePassword) => {
    if (token && email && !data.old) {
      return approveRecoveryPassword({ key: token, email, password: data.new })
    }

    if (!token && data.old) {
      return updatePassword({ password: data.new, oldPassword: data.old })
    }
  }

  const approveErrorMessage = approveError?.evaluatedMessage
  const updateErrorMessage = updateError?.evaluatedMessage

  const approveSuccessMessage = isApproveSuccess ? t("success") : null

  return (
    <Container className={classNames("change-password-form-container")}>
      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Container className={classNames("overflow-hidden")}>
          <p>{title}</p>
        </Container>

        {!token && (
          <Input
            type={oldPasswordType}
            name="oldPassword"
            placeholder={t("oldPassword") || ""}
            autoComplete="current-password"
            Icon={<PasswordIcon isSecure={oldPasswordType === "password"} onClick={onOldPasswordIconClick} />}
          />
        )}
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

        <DisplaySystemMessage
          errorMessage={approveErrorMessage || updateErrorMessage}
          successMessage={approveSuccessMessage}
        />

        {!isApproveSuccess && (
          <BasicButton
            type="submit"
            className={classNames("success-button", "my-3")}
            variant="primary"
            loading={isApproveLoading || isUpdateLoading}
            disabled={isApproveLoading || isUpdateLoading}
            defaultSize>
            {t("submit")}
          </BasicButton>
        )}

        {(isApproveSuccess || isUpdateSuccess) && (
          <BasicButton
            type="button"
            className={classNames("success-button", "my-3")}
            onClick={onSuccess}
            variant="primary"
            loading={isApproveLoading || isUpdateLoading}
            disabled={isApproveLoading || isUpdateLoading}
            defaultSize>
            {token ? t("backToLogin") : t("submit")}
          </BasicButton>
        )}
      </BasicFormProvider>
    </Container>
  )
}
