import { lazy, useEffect } from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Link, useLocation } from "react-router-dom"

import { LoginForm, useLoginTranslation } from "~/features/Login"
import { ROUTES, Theme } from "~/shared/constants"
import { Mixpanel } from "~/shared/utils"

const DownloadMobileLinks = lazy(() => import("~/widgets/DownloadMobileLinks"))

export const LoginPage = () => {
  const { t } = useLoginTranslation()
  const location = useLocation()

  const onCreateAccountClick = () => {
    Mixpanel.track("Create account button on login screen click")
  }

  useEffect(() => {
    Mixpanel.trackPageView("Login")
  }, [])

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
      <Box flex={1} padding="24px 32px" gap="20px" flexDirection="column">
        <Typography
          variant="h5"
          color={Theme.colors.light.onSurface}
          fontFamily="Atkinson"
          fontSize="22px"
          fontStyle="normal"
          fontWeight={700}
          lineHeight="28px"
          marginBottom="24px">
          {t("title")}
        </Typography>

        <Box className="loginForm" maxWidth="400px" margin="0 auto">
          <LoginForm locationState={location.state} />
        </Box>

        <Box margin="24px 0px" display="flex" justifyContent="center">
          <Typography
            fontFamily="Atkinson"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            lineHeight="20px"
            letterSpacing="0.1px">
            {t("or")},
          </Typography>
          &nbsp;
          <Typography
            color={Theme.colors.light.primary}
            fontFamily="Atkinson"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            lineHeight="20px"
            letterSpacing="0.1px"
            sx={{ textDecoration: "underline" }}>
            <Link to={ROUTES.signup.path} relative="path" onClick={onCreateAccountClick}>
              {t("create")}
            </Link>
          </Typography>
        </Box>

        <DownloadMobileLinks />
      </Box>
    </Box>
  )
}
