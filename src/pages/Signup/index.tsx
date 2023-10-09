import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Link, useLocation } from "react-router-dom"

import { SignupForm, useSignupTranslation } from "~/features/Signup"
import { ROUTES, Theme } from "~/shared/constants"

export const SignupPage = () => {
  const { t } = useSignupTranslation()
  const location = useLocation()

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
      <Box flex={1} padding="24px 32px">
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

        <Box className="signupForm" maxWidth="400px" margin="0 auto">
          <SignupForm locationState={location.state} />
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
            <Link to={ROUTES.login.path} relative="path">
              {t("logIn")}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
