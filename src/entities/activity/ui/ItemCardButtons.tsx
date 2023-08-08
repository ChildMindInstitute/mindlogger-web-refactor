import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import { ItemCardButtonsConfig } from "../lib"

import { useCustomTranslation } from "~/shared/utils"

import "./style.scss"

type ItemCardButtonsProps = {
  config: ItemCardButtonsConfig
  isSubmitShown: boolean
  onBackButtonClick?: () => void
  onNextButtonClick?: () => void
  onSubmitButtonClick?: () => void
}

export const ItemCardButton = ({
  config,
  isSubmitShown,
  onBackButtonClick,
  onNextButtonClick,
  onSubmitButtonClick,
}: ItemCardButtonsProps) => {
  const { t } = useCustomTranslation()

  const nextLabel = config.isNextDisabled && config.isSkippable ? t("Consent.skip") : t("Consent.next")
  const submitLabel = t("submit")

  return (
    <Box display="grid" justifyContent="center" alignItems="center" gridTemplateColumns="200px 1fr 200px">
      {(config.isBackShown && (
        <Button
          variant="outlined"
          onClick={onBackButtonClick}
          sx={{ gridColumn: "1/2", borderRadius: "100px", padding: "10px 24px" }}>
          {t("Consent.back")}
        </Button>
      )) || <></>}

      <Button
        variant="contained"
        sx={{ gridColumn: "3/4", borderRadius: "100px", padding: "10px 24px" }}
        disabled={!config.isSkippable && config.isNextDisabled}
        onClick={isSubmitShown ? onSubmitButtonClick : onNextButtonClick}>
        {isSubmitShown ? submitLabel : nextLabel}
      </Button>
    </Box>
  )
}
