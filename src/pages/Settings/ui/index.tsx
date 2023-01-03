import { Container } from "react-bootstrap"

import { ChangePasswordForm, useChangePasswordTranslation } from "~/features"
import { Avatar } from "~/shared"
import { useAuth } from "~/entities"

const Settings = () => {
  const { t } = useChangePasswordTranslation()
  const { user, auth } = useAuth()

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      <div className="text-center my-2 px-3">
        <div className="d-flex justify-content-center align-items-center">
          <Avatar />
          <h1>{t("greetings", { name: user.firstName })}</h1>
        </div>
        <hr></hr>

        <Container>
          <h3>{t("title")}</h3>
          <h5>{t("cautionMessage")}</h5>
        </Container>
        <Container>
          <ChangePasswordForm token={auth.token} />
        </Container>
      </div>
    </div>
  )
}

export default Settings
