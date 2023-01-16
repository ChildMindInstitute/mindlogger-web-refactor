import { isMobile } from "react-device-detect"

import { useAuth } from "~/entities/user"
import { Avatar } from "~/shared/ui"
import DownloadMobileLinks from "~/widgets/DownloadMobileLinks"

import { useProfileTranslation } from "../lib/useProfileTranslation"

const ProfilePage = () => {
  const { t } = useProfileTranslation()
  const { user } = useAuth()

  return (
    <div className="d-flex mp-3 align-self-start justify-content-center w-100 pt-3">
      <div className="text-center my-2 px-3">
        <div className="d-flex justify-content-center align-items-center">
          <Avatar />
          <h1>{user?.fullName}</h1>
        </div>
        <hr></hr>
        <div>{t("description")}</div>

        {isMobile && <DownloadMobileLinks />}
      </div>
    </div>
  )
}

export default ProfilePage
