import classNames from "classnames"
import { Container } from "react-bootstrap"

import { useChangePasswordTranslation } from "../lib/useChangePasswordTranslation"
import { ChangePasswordSchema, TChangePassword } from "../model/schema"

import { useUpdatePasswordMutation } from "~/entities/user"
import { BasicButton, BasicFormProvider, DisplaySystemMessage, Input, PasswordIcon } from "~/shared/ui"
import { useCustomForm, usePasswordType } from "~/shared/utils"

import "./style.scss"

interface ChangePasswordFormProps {
  title?: string | null
  token?: string
  temporaryToken?: string
  onSuccessExtended?: () => void
}

export const ChangePasswordForm = ({ title, token, temporaryToken, onSuccessExtended }: ChangePasswordFormProps) => {
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
  const { mutate: updatePassword, isLoading, data, error, isSuccess } = useUpdatePasswordMutation()

  const onSubmit = (data: TChangePassword) => {
    if (token && temporaryToken && !data.old) {
      return updatePassword({ token, new: data.new, old: temporaryToken })
    }

    if (token && !temporaryToken && data.old) {
      return updatePassword({ token, new: data.new, old: data.old })
    }
  }

  return (
    <Container className={classNames("change-password-form-container")}>
      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Container className={classNames("overflow-hidden")}>
          <p>{title}</p>
        </Container>

        {!temporaryToken && (
          <Input
            type={oldPasswordType}
            name="oldPassword"
            placeholder={t("oldPassword") || ""}
            autoComplete="current-password"
            onIconClick={onOldPasswordIconClick}
            Icon={<PasswordIcon isSecure={oldPasswordType === "password"} />}
          />
        )}
        <Input
          type={newPasswordType}
          name="newPassword"
          placeholder={t("newPassword") || ""}
          autoComplete="new-password"
          onIconClick={onNewPasswordIconClick}
          Icon={<PasswordIcon isSecure={newPasswordType === "password"} />}
        />
        <Input
          type={confirmNewPasswordType}
          name="confirmNewPassword"
          placeholder={t("confirmPassword") || ""}
          autoComplete="new-password"
          onIconClick={onConfirmNewPasswordIconClick}
          Icon={<PasswordIcon isSecure={confirmNewPasswordType === "password"} />}
        />

        <DisplaySystemMessage successMessage={data?.data?.message} errorMessage={error?.response?.data?.message} />

        {!isSuccess && (
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

        {isSuccess && temporaryToken && (
          <BasicButton
            type="button"
            className={classNames("success-button", "my-3")}
            onClick={onSuccess}
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            defaultSize>
            {t("backToLogin")}
          </BasicButton>
        )}
      </BasicFormProvider>
    </Container>
  )
}
