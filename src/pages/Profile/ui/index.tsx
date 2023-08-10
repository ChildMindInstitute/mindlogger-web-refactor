import Box from "@mui/material/Box"
import { isMobile } from "react-device-detect"

import { useProfileTranslation } from "../lib/useProfileTranslation"

import { userModel } from "~/entities/user"
import { AvatarBase } from "~/shared/ui"
import DownloadMobileLinks from "~/widgets/DownloadMobileLinks"

export const ProfilePage = () => {
  const { t } = useProfileTranslation()
  const { user } = userModel.hooks.useUserState()

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      <div className="text-center my-2 px-3">
        <div className="d-flex justify-content-center align-items-center">
          <Box sx={{ padding: "15px" }}>
            <AvatarBase name={`${user?.firstName} ${user?.lastName}`} height="40px" width="40px" />
          </Box>
          <h1>{`${user?.firstName} ${user?.lastName}`}</h1>
        </div>
        <hr></hr>
        <div>{t("description")}</div>

        {isMobile && <DownloadMobileLinks />}
      </div>
    </div>
  )
}
