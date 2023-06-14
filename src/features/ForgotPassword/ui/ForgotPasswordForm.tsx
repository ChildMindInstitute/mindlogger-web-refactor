import classNames from "classnames"
import { Container } from "react-bootstrap"

import { useForgotPasswordTranslation } from "../lib/useForgotPasswordTranslation"
import { ForgotPasswordSchema, TForgotPasswordForm } from "../model/schemas"

import { useRecoveryPasswordMutation } from "~/entities/user"
import { BasicButton, BasicFormProvider, DisplaySystemMessage, Input } from "~/shared/ui"
import { useCustomForm } from "~/shared/utils"

export const ForgotPasswordForm = () => {
  const { t } = useForgotPasswordTranslation()

  const form = useCustomForm({ defaultValues: { email: "" } }, ForgotPasswordSchema)

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = form

  const { mutate: recoveryPassword, isLoading, isSuccess, error } = useRecoveryPasswordMutation()

  const onForgotPasswordSubmit = (data: TForgotPasswordForm) => {
    recoveryPassword(data)
  }

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onForgotPasswordSubmit)}>
      <Container>
        <p>{t("formTitle")}</p>
      </Container>

      <Input type="text" name="email" placeholder={t("email") || ""} autoComplete="email" />

      <DisplaySystemMessage errorMessage={error?.evaluatedMessage} />

      <Container className={classNames("mt-3")}>
        {!isSuccess && (
          <BasicButton type="submit" variant="primary" disabled={!isValid || isLoading} loading={isLoading} defaultSize>
            {t("button")}
          </BasicButton>
        )}

        {isSuccess && <DisplaySystemMessage successMessage={t("successMessage", { email: watch("email") })} />}
      </Container>
    </BasicFormProvider>
  )
}
