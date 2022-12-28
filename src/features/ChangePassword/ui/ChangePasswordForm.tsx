import classNames from "classnames"
import { Col, Form, Row } from "react-bootstrap"

import { BasicButton, BasicFormProvider, Input, useCustomForm } from "~/shared"

import { useChangePasswordTranslation } from "../lib/useChangePasswordTranslation"
import { ChangePasswordSchema, TChangePassword } from "../model/schema"

import "./style.scss"

interface ChangePasswordFormProps {
  userId?: string
  temporaryToken?: string
}

export const ChangePasswordForm = ({ userId, temporaryToken }: ChangePasswordFormProps) => {
  const { t } = useChangePasswordTranslation()

  const form = useCustomForm(
    { defaultValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" } },
    ChangePasswordSchema,
  )
  const { handleSubmit } = form

  const onSubmit = (formData: TChangePassword) => {
    console.log(formData)
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
      {!userId && !temporaryToken && (
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm={3}>
            {`${t("oldPassword")}:`}
          </Form.Label>
          <Col sm={9}>
            <Input
              type="password"
              name="newPassword"
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
          <Input
            type="password"
            name="newPassword"
            placeholder={t("newPassword") || ""}
            autoComplete="current-password"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>{`${t("confirmPassword")}:`}</Form.Label>
        <Col sm={9}>
          <Input
            type="password"
            name="confirmNewPassword"
            placeholder={t("confirmPassword") || ""}
            autoComplete="current-password"
          />
        </Col>
      </Form.Group>

      <BasicButton type="submit" className={classNames("success-button", "my-3")} variant="success" color="white">
        {t("submit")}
      </BasicButton>
    </BasicFormProvider>
  )
}
