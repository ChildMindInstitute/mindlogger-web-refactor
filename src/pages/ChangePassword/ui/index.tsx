import { useEffect } from "react"
import { Alert, Container } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"

import { ChangePasswordForm, useChangePasswordTranslation } from "~/features"
import { useCheckTemporaryPasswordMutation } from "~/entities"
import { Avatar, ROUTES } from "~/shared"

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
        <div className="text-center my-2 px-3">
          <div className="d-flex justify-content-center align-items-center">
            <Avatar />
          </div>
          <hr></hr>
          <Container>
            <h3>{t("title")}</h3>
            <h5>{t("cautionMessage")}</h5>
          </Container>

          <Container>
            <ChangePasswordForm
              token={data?.data?.authToken?.token}
              temporaryToken={temporaryToken}
              onSuccessExtended={onPasswordUpdateSuccess}
            />
          </Container>
        </div>
      )}
    </div>
  )
}

export default ChangePassword
