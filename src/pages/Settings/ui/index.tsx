import { Container } from "react-bootstrap"
import classNames from "classnames"

import { ChangePasswordForm, useChangePasswordTranslation } from "~/features/ChangePassword"
import { Avatar } from "~/shared/ui"
import { useAuth } from "~/entities/user"

const Settings = () => {
  const { t } = useChangePasswordTranslation()
  const { user, auth } = useAuth()

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      <div className="text-center my-2 px-3">
        <div className="d-flex justify-content-start align-items-center">
          <Avatar />
          <h5>{t("settings", { name: user.firstName })}</h5>
        </div>
        <hr></hr>

        <Container>
          <h3 className={classNames("text-primary", "my-4")}>{t("settingsTitle")}</h3>
        </Container>
        <Container>
          <ChangePasswordForm token={auth.token} title={t("formTitle", { email: user.email })} />
        </Container>
      </div>
    </div>
  )
}

export default Settings
