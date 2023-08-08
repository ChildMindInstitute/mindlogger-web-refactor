import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"

import { ItemCardButtonsConfig } from "../lib"

import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

import "./style.scss"

type ItemCardButtonsProps = {
  config: ItemCardButtonsConfig
  isLoading: boolean
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
  isLoading,
}: ItemCardButtonsProps) => {
  const { t } = useCustomTranslation()

  const nextLabel = config.isNextDisabled && config.isSkippable ? t("Consent.skip") : t("Consent.next")
  const submitLabel = t("submit")

  const nextOrSubmitButtonLabel = isSubmitShown ? submitLabel : nextLabel

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

      {isLoading ? (
        <Button
          variant="contained"
          sx={{ gridColumn: "3/4", borderRadius: "100px", padding: "10px 24px" }}
          disabled={isLoading}
          onClick={isSubmitShown ? onSubmitButtonClick : onNextButtonClick}>
          <CircularProgress size={25} sx={{ color: Theme.colors.light.onPrimary }} />
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ gridColumn: "3/4", borderRadius: "100px", padding: "10px 24px" }}
          disabled={!config.isSkippable && config.isNextDisabled}
          onClick={isSubmitShown ? onSubmitButtonClick : onNextButtonClick}>
          {nextOrSubmitButtonLabel}
        </Button>
      )}
    </Box>
  )
}
