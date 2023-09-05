import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"

import { userModel } from "~/entities/user"
import { ChangePasswordForm, useChangePasswordTranslation } from "~/features/ChangePassword"
import { Theme } from "~/shared/constants"
import { AvatarBase } from "~/shared/ui"

export const SettingsPage = () => {
  const { t } = useChangePasswordTranslation()
  const { user } = userModel.hooks.useUserState()

  return (
    <Box display="flex" justifyContent="center" alignItems="center" margin="24px 0px" textAlign="center">
      <Box>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Box sx={{ padding: "0px 15px" }}>
            <AvatarBase name={`${user?.firstName} ${user?.lastName}`} width="40px" height="40px" />
          </Box>
          <Typography variant="h6" marginBottom="8px">
            {t("settings", { name: `${user?.firstName} ${user?.lastName}` })}
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: "rgba(0,0,0, 0.5)", marginTop: "8px", marginBottom: "24px" }} />

        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography variant="h5" color={Theme.colors.light.primary}>
            {t("settingsTitle")}
          </Typography>
          <ChangePasswordForm title={t("formTitle", { email: user?.email })} />
        </Box>
      </Box>
    </Box>
  )
}
