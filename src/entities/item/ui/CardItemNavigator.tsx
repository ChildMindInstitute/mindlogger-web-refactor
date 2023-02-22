import classNames from "classnames"

import { BasicButton } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

interface CardItemNavigatorProps {
  isBackButtonShown?: boolean
  onBackButtonClick?: () => void

  isSubmitButtonShown?: boolean
  isNextButtonShown?: boolean
  onNextButtonClick?: () => void

  isSkippable?: boolean
  isNextButtonDisable?: boolean
}

export const CardItemNavigator = ({
  isBackButtonShown,
  onBackButtonClick,
  isNextButtonShown,
  onNextButtonClick,
  isSkippable,
  isNextButtonDisable,
  isSubmitButtonShown,
}: CardItemNavigatorProps) => {
  const { t } = useCustomTranslation()

  const isDisable = !isSkippable && isNextButtonDisable

  const conditionNextButtonLabel = isNextButtonDisable && isSkippable ? t("Consent.skip") : t("Consent.next")

  return (
    <div className={classNames("d-flex", "flex-row", "justify-content-around")}>
      <div>
        {isBackButtonShown && onBackButtonClick && (
          <BasicButton
            type="button"
            className={classNames("mb-2", "navigator-button")}
            onClick={onBackButtonClick}
            variant="outline-dark"
            size="lg">
            {t("Consent.back")}
          </BasicButton>
        )}
      </div>
      <div>
        {isNextButtonShown && onNextButtonClick && (
          <BasicButton
            disabled={isDisable}
            className={classNames("mb-2", "navigator-button")}
            onClick={onNextButtonClick}
            variant="outline-dark"
            size="lg">
            {isSubmitButtonShown ? t("submit") : conditionNextButtonLabel}
          </BasicButton>
        )}
      </div>
    </div>
  )
}
