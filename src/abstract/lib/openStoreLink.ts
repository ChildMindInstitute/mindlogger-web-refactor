import { isIOS, isMacOs } from "react-device-detect"

import { APPSTORE_LINK, GOOGLEPLAY_LINK } from "./constants"

export const openStoreLink = () => {
  const isAppleDevice = isIOS || isMacOs

  const storeLink = isAppleDevice ? APPSTORE_LINK : GOOGLEPLAY_LINK
  return window.open(storeLink, "_blank", "noopener noreferrer")
}
