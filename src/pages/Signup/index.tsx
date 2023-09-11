import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Link, useLocation } from "react-router-dom"

import { SignupForm, useSignupTranslation } from "~/features/Signup"
import { ROUTES, Theme } from "~/shared/constants"

export const SignupPage = () => {
  const { t } = useSignupTranslation()
  const location = useLocation()

  return (
    <Box display="flex" justifyContent="center" flex={1}>
      <Box textAlign="center" margin="24px 0px" flex={1} padding="0px 12px">
        <Typography variant="h4" margin="16px 0px">
          {t("title")}
        </Typography>

        <Box
          className="signupForm"
          maxWidth="400px"
          padding="10px"
          bgcolor={Theme.colors.light.onPrimary}
          margin="0 auto">
          <SignupForm locationState={location.state} />
          <p className="my-3">
            {t("account")} <Link to={ROUTES.login.path}> {t("logIn")}</Link>
          </p>
        </Box>
      </Box>
    </Box>
  )
}
