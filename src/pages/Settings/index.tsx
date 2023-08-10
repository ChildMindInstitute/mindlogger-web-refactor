import Box from "@mui/material/Box"
import classNames from "classnames"
import { Container } from "react-bootstrap"

import { userModel } from "~/entities/user"
import { ChangePasswordForm, useChangePasswordTranslation } from "~/features/ChangePassword"
import { AvatarBase } from "~/shared/ui"

export const SettingsPage = () => {
  const { t } = useChangePasswordTranslation()
  const { user } = userModel.hooks.useUserState()

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      <div className="text-center my-2 px-3">
        <div className="d-flex justify-content-start align-items-center">
          <Box sx={{ padding: "0px 15px" }}>
            <AvatarBase name={`${user?.firstName} ${user?.lastName}`} width="40px" height="40px" />
          </Box>
          <h5>{t("settings", { name: `${user?.firstName} ${user?.lastName}` })}</h5>
        </div>
        <hr></hr>

        <Container>
          <h3 className={classNames("text-primary", "my-4")}>{t("settingsTitle")}</h3>
        </Container>
        <Container>
          <ChangePasswordForm title={t("formTitle", { email: user?.email })} />
        </Container>
      </div>
    </div>
  )
}
