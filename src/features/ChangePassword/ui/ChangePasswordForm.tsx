import classNames from "classnames"
import { Col, Form, Row } from "react-bootstrap"

import { BasicButton, BasicFormProvider, Input, useCustomForm } from "~/shared"
import { useUpdatePasswordMutation } from "~/entities"

import { useChangePasswordTranslation } from "../lib/useChangePasswordTranslation"
import { ChangePasswordSchema, TChangePassword } from "../model/schema"

import "./style.scss"

interface ChangePasswordFormProps {
  token?: string
  temporaryToken?: string
  onSuccessExtended?: () => void
}

export const ChangePasswordForm = ({ token, temporaryToken, onSuccessExtended }: ChangePasswordFormProps) => {
  const { t } = useChangePasswordTranslation()

  const form = useCustomForm({ defaultValues: { old: "", new: "", confirm: "" } }, ChangePasswordSchema)
  const { handleSubmit } = form

  const onSuccess = () => {
    if (onSuccessExtended) {
      onSuccessExtended()
    }
  }
  const { mutate: updatePassword, isLoading } = useUpdatePasswordMutation({ onSuccess })

  const onSubmit = (data: TChangePassword) => {
    if (token && temporaryToken && !data.old) {
      return updatePassword({ token, new: data.new, old: temporaryToken })
    }
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
      {!token && !temporaryToken && (
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm={3}>
            {`${t("oldPassword")}:`}
          </Form.Label>
          <Col sm={9}>
            <Input
              type="password"
              name="oldPassword"
              placeholder={t("oldPassword") || ""}
              autoComplete="current-password"
            />
          </Col>
        </Form.Group>
      )}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>
          {`${t("newPassword")}:`}
        </Form.Label>
        <Col sm={9}>
          <Input type="password" name="newPassword" placeholder={t("newPassword") || ""} autoComplete="new-password" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>{`${t("confirmPassword")}:`}</Form.Label>
        <Col sm={9}>
          <Input
            type="password"
            name="confirmNewPassword"
            placeholder={t("confirmPassword") || ""}
            autoComplete="new-password"
          />
        </Col>
      </Form.Group>

      <BasicButton
        type="submit"
        className={classNames("success-button", "my-3")}
        variant="success"
        loading={isLoading}
        disabled={isLoading}>
        {t("submit")}
      </BasicButton>
    </BasicFormProvider>
  )
}
