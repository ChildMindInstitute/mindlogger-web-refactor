import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"

import { ChangePasswordForm, useChangePasswordTranslation } from "~/features/ChangePassword"
import { ROUTES } from "~/shared/utils"

const ChangePassword = () => {
  const { token, email } = useParams()
  const navigate = useNavigate()

  const { t } = useChangePasswordTranslation()

  const onPasswordUpdateSuccess = () => {
    return navigate(ROUTES.login.path)
  }

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      <div className="text-center my-2 px-3 w-100">
        <Container>
          <h3 className={classNames("text-primary")}>{t("title")}</h3>
        </Container>

        <ChangePasswordForm
          title={t("formTitle", { email: email })}
          token={token}
          email={email}
          onSuccessExtended={onPasswordUpdateSuccess}
        />
      </div>
    </div>
  )
}

export default ChangePassword
