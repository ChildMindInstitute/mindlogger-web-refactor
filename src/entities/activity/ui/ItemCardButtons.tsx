import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"

import { ItemCardButtonsConfig } from "../lib"
import { ActivityEventProgressRecord } from "../model/types"

import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

type ItemCardButtonsProps = {
  currentItem: ActivityEventProgressRecord | null

  isLoading: boolean
  isAllItemsSkippable: boolean
  isSubmitShown: boolean
  hasPrevStep: boolean

  onBackButtonClick?: () => void
  onNextButtonClick?: () => void
  onSubmitButtonClick?: () => void
}

export const ItemCardButton = ({
  isSubmitShown,
  onBackButtonClick,
  onNextButtonClick,
  onSubmitButtonClick,
  isLoading,
  currentItem,
  isAllItemsSkippable,
  hasPrevStep,
}: ItemCardButtonsProps) => {
  const { t } = useCustomTranslation()

  const isMessageItem = currentItem?.responseType === "message"
  const isAudioPlayerItem = currentItem?.responseType === "audioPlayer"

  const isItemWithoutAnswer = isMessageItem || isAudioPlayerItem

  const config: ItemCardButtonsConfig = {
    isNextDisabled: isItemWithoutAnswer ? false : !currentItem?.answer || !currentItem.answer.length,
    isSkippable: currentItem?.config.skippableItem || isAllItemsSkippable,
    isBackShown: hasPrevStep && !currentItem?.config.removeBackButton,
  }

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
