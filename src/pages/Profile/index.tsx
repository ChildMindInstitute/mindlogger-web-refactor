import { lazy } from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { isMobile } from "react-device-detect"

import { userModel } from "~/entities/user"
import { AvatarBase } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

const DownloadMobileLinks = lazy(() => import("~/widgets/DownloadMobileLinks"))

function ProfilePage() {
  const { t } = useCustomTranslation({ keyPrefix: "Profile" })
  const { user } = userModel.hooks.useUserState()

  return (
    <Box flex={1} textAlign="center" margin="24px 0px">
      <Box margin="0 auto" maxWidth="800px" padding="0px 12px">
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
    </Box>
  )
}

export default ProfilePage
