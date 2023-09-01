import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Link, useLocation } from "react-router-dom"

import { SignupForm, useSignupTranslation } from "~/features/Signup"
import { ROUTES } from "~/shared/constants"
import { PageContainer } from "~/shared/ui"

import "./styles.scss"

export const SignupPage = () => {
  const { t } = useSignupTranslation()
  const location = useLocation()

  return (
    <PageContainer id="signup-page" dataTestId="signup-page">
      <Box textAlign="center" margin="24px 0px" display="flex" alignItems="center" flexDirection="column">
        <Typography variant="h4">{t("title")}</Typography>

        <Box className="signupForm" width="400px">
          <SignupForm locationState={location.state} />

          <p className="my-3">
            {t("account")} <Link to={ROUTES.login.path}> {t("logIn")}</Link>
          </p>
        </Box>
      </Box>
    </PageContainer>
  )
}
