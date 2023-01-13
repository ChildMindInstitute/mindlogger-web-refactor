import { useEffect } from "react"

import classNames from "classnames"
import { Alert, Container } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"

import { useCheckTemporaryPasswordMutation } from "~/entities/user"
import { ChangePasswordForm, useChangePasswordTranslation } from "~/features/ChangePassword"
import { ROUTES } from "~/shared/utils"

const ChangePassword = () => {
  const { userId, temporaryToken } = useParams()
  const navigate = useNavigate()

  const { t } = useChangePasswordTranslation()

  const { mutate: checkTemporaryPassword, isError, isSuccess, isLoading, data } = useCheckTemporaryPasswordMutation()

  useEffect(() => {
    if (userId && temporaryToken) {
      checkTemporaryPassword({ userId, temporaryToken })
    }
  }, [userId, temporaryToken, checkTemporaryPassword])

  const onPasswordUpdateSuccess = () => {
    return navigate(ROUTES.login.path)
  }

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      {isLoading && <Container>Loading..</Container>}

      {isError && (
        <Alert className="text-center" variant="danger">
          Invalid or Expired Link.
        </Alert>
      )}

      {isSuccess && (
        <div className="text-center my-2 px-3 w-100">
          <Container>
            <h3 className={classNames("text-primary")}>{t("title")}</h3>
          </Container>

          <ChangePasswordForm
            title={t("formTitle", { email: data?.data?.user?.email })}
            token={data?.data?.authToken?.token}
            temporaryToken={temporaryToken}
            onSuccessExtended={onPasswordUpdateSuccess}
          />
        </div>
      )}
    </div>
  )
}

export default ChangePassword
