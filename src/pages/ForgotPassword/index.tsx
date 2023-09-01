import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { ForgotPasswordForm, useForgotPasswordTranslation } from "~/features/ForgotPassword"
import { Theme } from "~/shared/constants"

import "./style.scss"

export const ForgotPasswordPage = () => {
  const { t } = useForgotPasswordTranslation()

  return (
    <Box display="flex" flex={1}>
      <Box flex={1} textAlign="center" margin="24px 0px" padding="0px 12px">
        <Typography variant="h4" margin="16px 0px">
          {t("title")}
        </Typography>

        <Box bgcolor={Theme.colors.light.onPrimary} padding="10px" maxWidth="400px" margin="0 auto">
          <ForgotPasswordForm />
        </Box>
      </Box>
    </Box>
  )
}
