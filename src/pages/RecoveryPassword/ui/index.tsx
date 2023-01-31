import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

import { RecoveryPasswordForm, useRecoveryPasswordTranslation } from "~/features/RecoveryPassword"

const RecoveryPassword = () => {
  const { token, email } = useParams()
  const { t } = useRecoveryPasswordTranslation()

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      <div className="text-center my-2 px-3 w-100">
        <Container>
          <h3 className={classNames("text-primary")}>{t("title")}</h3>
        </Container>

        <RecoveryPasswordForm title={t("formTitle", { email })} token={token} email={email} />
      </div>
    </div>
  )
}

export default RecoveryPassword
