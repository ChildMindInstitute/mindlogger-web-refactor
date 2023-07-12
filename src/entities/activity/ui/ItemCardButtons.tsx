import classNames from "classnames"

import { ItemCardButtonsConfig } from "../lib"

import { BasicButton } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

import "./style.scss"

type ItemCardButtonsProps = {
  config: ItemCardButtonsConfig
  isSubmitShown: boolean
  isOnePageAssessment: boolean
  onBackButtonClick?: () => void
  onNextButtonClick?: () => void
  onSubmitButtonClick?: () => void
}

export const ItemCardButton = ({
  config,
  isSubmitShown,
  isOnePageAssessment,
  onBackButtonClick,
  onNextButtonClick,
  onSubmitButtonClick,
}: ItemCardButtonsProps) => {
  const { t } = useCustomTranslation()

  const nextLabel = config.isNextDisabled && config.isSkippable ? t("Consent.skip") : t("Consent.next")
  const submitLabel = t("submit")

  if (isOnePageAssessment) {
    return (
      <div className={classNames("no-gutters", "d-flex", "flex-row", "justify-content-around")}>
        {(isSubmitShown && (
          <BasicButton
            variant="outline-dark"
            size="lg"
            onClick={onSubmitButtonClick}
            className={classNames("mb-2", "navigator-button")}>
            {submitLabel}
          </BasicButton>
        )) || <div />}

        {config.isSkippable && (
          <BasicButton
            disabled={!config.isNextDisabled}
            variant="outline-dark"
            size="lg"
            className={classNames("mb-2", "navigator-button")}>
            {t("Consent.skip")}
          </BasicButton>
        )}
      </div>
    )
  }

  return (
    <div className={classNames("no-gutters", "d-flex", "flex-row", "justify-content-around")}>
      {(config.isBackShown && (
        <BasicButton
          variant="outline-dark"
          size="lg"
          onClick={onBackButtonClick}
          className={classNames("mb-2", "navigator-button")}>
          {t("Consent.back")}
        </BasicButton>
      )) || <div />}

      <BasicButton
        variant="outline-dark"
        size="lg"
        disabled={!config.isSkippable && config.isNextDisabled}
        className={classNames("mb-2", "navigator-button")}
        onClick={isSubmitShown ? onSubmitButtonClick : onNextButtonClick}>
        {isSubmitShown ? submitLabel : nextLabel}
      </BasicButton>
    </div>
  )
}
