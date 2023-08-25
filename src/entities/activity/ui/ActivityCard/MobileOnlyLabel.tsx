import classNames from "classnames"
import { isIOS, isMobile } from "react-device-detect"

import { GOOGLEPLAY_LINK, APPSTORE_LINK } from "~/shared/constants"
import { BoxLabel } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

export const MobileOnlyLabel = () => {
  const { t } = useCustomTranslation()

  const storeLink = isIOS ? APPSTORE_LINK : GOOGLEPLAY_LINK

  return (
    <div className={classNames("d-flex", "justify-content-center", "align-item-center")}>
      {isMobile ? (
        <a href={storeLink} target="_blank" rel="noreferrer">
          <BoxLabel message={t("mobileOnly")} />
        </a>
      ) : (
        <BoxLabel message={t("mobileOnly")} />
      )}
    </div>
  )
}
