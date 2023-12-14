import { actions } from "../model"
import { selectAppletConsents } from "../model/selectors"
import { ConsentCheckbox } from "./ConsentCheckbox"
import { ConsentPublicModel } from "./ConsentPublicModel"

import { useAppDispatch, useAppSelector, useCustomTranslation } from "~/shared/utils"

type Props = {
  appletId: string
}

export const SharedContentConsent = ({ appletId }: Props) => {
  const { t } = useCustomTranslation()

  const dispatch = useAppDispatch()

  const consents = useAppSelector(state => selectAppletConsents(state, appletId))

  if (!consents) {
    return null
  }

  const toggleShareConsent = () => {
    dispatch(actions.toggleShareConsent({ appletId }))
  }

  const toggleMediaConsent = () => {
    dispatch(actions.toggleMediaConsent({ appletId }))
  }

  return (
    <div className="d-flex justify-content-center m-2">
      <div className="d-flex flex-column">
        <ConsentCheckbox
          id={`shareToPublic-${appletId}`}
          value={consents.shareToPublic}
          onChange={toggleShareConsent}
          label={
            <p>
              {t("data_sharing.consent")} {<ConsentPublicModel />}
            </p>
          }
        />
        <ConsentCheckbox
          id={`shareMediaToPublic-${appletId}`}
          value={consents.shareMediaToPublic}
          onChange={toggleMediaConsent}
          className="ms-3"
          label={
            <p>
              {t("data_sharing.media_consent")} {<ConsentPublicModel />}
            </p>
          }
        />
      </div>
    </div>
  )
}
