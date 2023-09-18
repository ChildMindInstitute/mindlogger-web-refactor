import Box from "@mui/material/Box"

import AppStore from "~/assets/d-app-store-button.svg"
import GooglePlay from "~/assets/d-google-play-button.svg"
import { APPSTORE_LINK, GOOGLEPLAY_LINK } from "~/shared/constants"

const DownloadMobileLinks = () => {
  return (
    <Box display="flex" justifyContent="center" gap="16px">
      <a href={APPSTORE_LINK} target="_blank" rel="noreferrer">
        <img src={AppStore} alt="App Store Icon" />
      </a>
      <a href={GOOGLEPLAY_LINK} target="_blank" rel="noreferrer">
        <img src={GooglePlay} alt="Google Play Icon" />
      </a>
    </Box>
  )
}

export default DownloadMobileLinks
