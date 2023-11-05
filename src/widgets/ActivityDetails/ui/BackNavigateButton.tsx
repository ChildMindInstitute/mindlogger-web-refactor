import { ArrowLeft } from "react-bootstrap-icons"

import { BasicButton } from "~/shared/ui"
import { useCustomNavigation, useCustomTranslation } from "~/shared/utils"

export const BackNavigateButton = () => {
  const { t } = useCustomTranslation()
  const navigator = useCustomNavigation()

  const onBackButtonClick = () => {
    navigator.goBack()
  }

  return (
    <BasicButton variant="primary" className="mb-2 d-flex align-items-center" onClick={onBackButtonClick}>
      <ArrowLeft className="me-1" />
      {t("Consent.back")}
    </BasicButton>
  )
}
