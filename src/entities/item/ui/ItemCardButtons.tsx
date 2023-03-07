import classNames from "classnames"

import { ItemCardButtonsConfig } from "../lib"

import { BasicButton } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

import "./style.scss"

type ItemCardButtonsProps = {
  config: ItemCardButtonsConfig
  onBackButtonClick?: () => void
  onNextButtonClick?: () => void
  onSubmitButtonClick?: () => void
}

export const ItemCardButton = ({
  config,
  onBackButtonClick,
  onNextButtonClick,
  onSubmitButtonClick,
}: ItemCardButtonsProps) => {
  const { t } = useCustomTranslation()

  const nextLabel = config.isNextDisable && config.isSkippable ? t("Consent.skip") : t("Consent.next")
  const submitLabel = t("submit")

  if (config.isOnePageAssessment) {
    return (
      <div className={classNames("no-gutters", "d-flex", "flex-row", "justify-content-around")}>
        {(config.isSubmitShown && (
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
            disabled={!config.isNextDisable}
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
        disabled={!config.isSkippable && config.isNextDisable}
        className={classNames("mb-2", "navigator-button")}
        onClick={config.isSubmitShown ? onSubmitButtonClick : onNextButtonClick}>
        {config.isSubmitShown ? submitLabel : nextLabel}
      </BasicButton>
    </div>
  )
}
