import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useSearchParams } from "react-router-dom"

import { useRecoveryPasswordLinkHealthcheckQuery } from "~/entities/user"
import { RecoveryPasswordForm, useRecoveryPasswordTranslation } from "~/features/RecoveryPassword"
import { Loader, PageMessage } from "~/shared/ui"

export const RecoveryPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const { t } = useRecoveryPasswordTranslation()

  const key = searchParams.get("key")
  const email = searchParams.get("email")

  const { isError, isLoading, error } = useRecoveryPasswordLinkHealthcheckQuery({ email: email!, key: key! })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <PageMessage message={error.evaluatedMessage!} />
  }

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      <div className="text-center my-2 px-3 w-100">
        <Container>
          <h3 className={classNames("text-primary")}>{t("title")}</h3>
        </Container>

        <RecoveryPasswordForm title={t("formTitle", { email })} token={key} email={email} />
      </div>
    </div>
  )
}
