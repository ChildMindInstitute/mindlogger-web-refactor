import classNames from "classnames"
import { Container } from "react-bootstrap"

import { BasicButton, BasicFormProvider, DisplaySystemMessage, Input } from "~/shared/ui"
import { useCustomForm } from "~/shared/utils"
import { useApproveRecoveryPasswordMutation, useUpdatePasswordMutation } from "~/entities/user"

import { useChangePasswordTranslation } from "../lib/useChangePasswordTranslation"
import { ChangePasswordSchema, TChangePassword } from "../model/schema"

import "./style.scss"
import { useMemo } from "react"

interface ChangePasswordFormProps {
  title?: string | null
  token?: string
  email?: string
  onSuccessExtended?: () => void
}

export const ChangePasswordForm = ({ title, token, email, onSuccessExtended }: ChangePasswordFormProps) => {
  const { t } = useChangePasswordTranslation()

  const form = useCustomForm({ defaultValues: { old: "", new: "", confirm: "" } }, ChangePasswordSchema)
  const { handleSubmit } = form

  const onSuccess = () => {
    if (onSuccessExtended) {
      onSuccessExtended()
    }
  }

  const {
    mutate: updatePassword,
    data: updateData,
    error: updateError,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useUpdatePasswordMutation()
  const {
    mutate: approveRecoveryPassword,
    isSuccess: isApproveSuccess,
    isLoading: isApproveLoading,
    data: approveData,
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

  const approveSuccessMessage = useMemo(() => approveData?.data?.result?.message, [approveData])
  const approveErrorMessage = useMemo(() => approveError?.response?.data?.message, [approveError])

  const updateSuccessMessage = useMemo(() => updateData?.data?.message, [updateData])
  const updateErrorMessage = useMemo(() => updateError?.response?.data?.message, [updateError])

  return (
    <Container className={classNames("change-password-form-container")}>
      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Container className={classNames("overflow-hidden")}>
          <p>{title}</p>
        </Container>

        {!token && (
          <Input
            type="password"
            name="oldPassword"
            placeholder={t("oldPassword") || ""}
            autoComplete="current-password"
          />
        )}
        <Input type="password" name="newPassword" placeholder={t("newPassword") || ""} autoComplete="new-password" />
        <Input
          type="password"
          name="confirmNewPassword"
          placeholder={t("confirmPassword") || ""}
          autoComplete="new-password"
        />

        <DisplaySystemMessage
          successMessage={approveSuccessMessage || updateSuccessMessage}
          errorMessage={approveErrorMessage || updateErrorMessage}
        />

        {(!isApproveSuccess || !isUpdateSuccess) && (
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
