import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Link, useLocation } from "react-router-dom"

import { LoginForm, useLoginTranslation } from "~/features/Login"
import { ROUTES, Theme } from "~/shared/constants"
import { BasicButton, PageContainer } from "~/shared/ui"
import DownloadMobileLinks from "~/widgets/DownloadMobileLinks"

import "./login.scss"

export const LoginPage = () => {
  const { t } = useLoginTranslation()
  const location = useLocation()

  return (
    <PageContainer id="login-page" dataTestId="login-page">
      <Box textAlign="center" margin="24px 0px" display="flex" alignItems="center" flexDirection="column">
        <Box>
          <Typography variant="h5" color={Theme.colors.light.primary}>
            {t("welcomeMessage")}
          </Typography>
          <Typography variant="h5" color={Theme.colors.light.primary}>
            {t("appType")}
          </Typography>
        </Box>

        <Box className="loginForm" width="400px">
          <LoginForm locationState={location.state} />

          <BasicButton type="button" variant="outline-primary" className="mb-3" defaultSize>
            <Link to={ROUTES.signup.path} relative="path">
              {t("create")}
            </Link>
          </BasicButton>
        </Box>

        <DownloadMobileLinks />
      </Box>
    </PageContainer>
  )
}
