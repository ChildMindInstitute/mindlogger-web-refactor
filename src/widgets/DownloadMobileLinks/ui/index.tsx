import { Container } from "react-bootstrap"

import AppStore from "~/assets/AppStore.svg"
import GooglePlay from "~/assets/GooglePlay.svg"

import { APPSTORE_LINK, GOOGLEPLAY_LINK } from "../lib/constants"
import { useDownloadMobileTranslation } from "../lib/useDownloadMobileTranslation"

const DownloadMobileLinks = () => {
  const { t } = useDownloadMobileTranslation()

  return (
    <Container>
      <Container className="mt-3 mb-2">
        <p>{t("downloadMobile")}</p>
      </Container>
      <Container className="d-flex gap-3 justify-content-center">
        <a href={APPSTORE_LINK} target="_blank" rel="noreferrer">
          <img src={AppStore} alt="App Store Icon" />
        </a>
        <a href={GOOGLEPLAY_LINK} target="_blank" rel="noreferrer">
          <img src={GooglePlay} alt="Google Play Icon" />
        </a>
      </Container>
    </Container>
  )
}

export default DownloadMobileLinks
