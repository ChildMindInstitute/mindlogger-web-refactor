import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { isMobile } from "react-device-detect"

import { useProfileTranslation } from "../lib/useProfileTranslation"

import { userModel } from "~/entities/user"
import { AvatarBase } from "~/shared/ui"
import DownloadMobileLinks from "~/widgets/DownloadMobileLinks"

export const ProfilePage = () => {
  const { t } = useProfileTranslation()
  const { user } = userModel.hooks.useUserState()

  return (
    <Box sx={{ textAlign: "center" }} marginTop="24px">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box sx={{ padding: "15px" }}>
          <AvatarBase name={`${user?.firstName} ${user?.lastName}`} height="40px" width="40px" />
        </Box>
        <Typography variant="h4">{`${user?.firstName} ${user?.lastName}`}</Typography>
      </Box>
      <hr></hr>
      <Typography variant="body1" sx={{ cursor: "default" }}>
        {t("description")}
      </Typography>

      {isMobile && <DownloadMobileLinks />}
    </Box>
  )
}
