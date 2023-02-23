import { ArrowLeft } from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom"

import { BasicButton } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

export const BackNavigateButton = () => {
  const { t } = useCustomTranslation()
  const navigate = useNavigate()

  const onBackButtonClick = () => {
    navigate(-1)
  }

  return (
    <BasicButton variant="primary" className="mb-2 d-flex align-items-center" onClick={onBackButtonClick}>
      <ArrowLeft className="me-1" />
      {t("Consent.back")}
    </BasicButton>
  )
}
