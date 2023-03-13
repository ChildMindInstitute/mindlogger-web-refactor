import { ArrowLeft } from "react-bootstrap-icons"

import { activityModel } from "~/entities/activity"
import { BasicButton } from "~/shared/ui"
import { useCustomNavigation, useCustomTranslation } from "~/shared/utils"

export const BackNavigateButton = () => {
  const { t } = useCustomTranslation()
  const navigator = useCustomNavigation()

  const { clearActivity } = activityModel.hooks.useActivityState()

  const onBackButtonClick = () => {
    clearActivity()
    return navigator.goBack()
  }

  return (
    <BasicButton variant="primary" className="mb-2 d-flex align-items-center" onClick={onBackButtonClick}>
      <ArrowLeft className="me-1" />
      {t("Consent.back")}
    </BasicButton>
  )
}
