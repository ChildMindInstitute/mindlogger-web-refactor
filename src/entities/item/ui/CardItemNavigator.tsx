import classNames from "classnames"
import { Row } from "react-bootstrap"

import { BasicButton } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

interface CardItemNavigatorProps {
  isBackButtonShown?: boolean
  onBackButtonClick?: () => void

  isNextButtonShown?: boolean
  onNextButtonClick?: () => void
}

export const CardItemNavigator = ({
  isBackButtonShown,
  onBackButtonClick,
  isNextButtonShown,
  onNextButtonClick,
}: CardItemNavigatorProps) => {
  const { t } = useCustomTranslation()

  return (
    <div className={classNames("d-flex", "flex-row", "justify-content-around")}>
      {isBackButtonShown && onBackButtonClick && (
        <BasicButton
          type="button"
          className={classNames("mb-2")}
          onClick={onBackButtonClick}
          variant="outline-dark"
          size="lg">
          {t("Consent.back")}
        </BasicButton>
      )}
      {isNextButtonShown && onNextButtonClick && (
        <BasicButton className={classNames("mb-2")} onClick={onNextButtonClick} variant="outline-dark" size="lg">
          {t("Consent.next")}
        </BasicButton>
      )}
    </div>
  )
}
