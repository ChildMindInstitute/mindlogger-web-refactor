import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useSearchParams } from "react-router-dom"

import { RecoveryPasswordForm, useRecoveryPasswordTranslation } from "~/features/RecoveryPassword"

const RecoveryPassword = () => {
  const [searchParams] = useSearchParams()
  const { t } = useRecoveryPasswordTranslation()

  const key = searchParams.get("key")
  const email = searchParams.get("email")

  if (!key && !email) {
    return <div>{t("invalidLink")}</div>
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

export default RecoveryPassword
