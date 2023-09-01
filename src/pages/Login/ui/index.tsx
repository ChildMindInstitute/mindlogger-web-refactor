import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Link, useLocation } from "react-router-dom"

import { LoginForm, useLoginTranslation } from "~/features/Login"
import { ROUTES, Theme } from "~/shared/constants"
import { BasicButton } from "~/shared/ui"
import DownloadMobileLinks from "~/widgets/DownloadMobileLinks"

import "./login.scss"

export const LoginPage = () => {
  const { t } = useLoginTranslation()
  const location = useLocation()

  return (
    <Box textAlign="center" display="flex" justifyContent="center" flex={1}>
      <Box flex={1} margin="24px 0px" padding="0px 12px">
        <Box margin="16px 0px">
          <Typography variant="h5" color={Theme.colors.light.primary}>
            {t("welcomeMessage")}
          </Typography>
          <Typography variant="h5" color={Theme.colors.light.primary}>
            {t("appType")}
          </Typography>
        </Box>

        <Box
          className="loginForm"
          bgcolor={Theme.colors.light.onPrimary}
          padding="10px"
          maxWidth="400px"
          margin="0 auto">
          <LoginForm locationState={location.state} />

          <BasicButton type="button" variant="outline-primary" className="mb-3" defaultSize>
            <Link to={ROUTES.signup.path} relative="path">
              {t("create")}
            </Link>
          </BasicButton>
        </Box>

        <DownloadMobileLinks />
      </Box>
    </Box>
  )
}
