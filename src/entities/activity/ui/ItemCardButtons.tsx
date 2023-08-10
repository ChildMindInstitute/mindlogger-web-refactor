import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"

import { ItemCardButtonsConfig } from "../lib"
import { ActivityEventProgressRecord } from "../model/types"

import { Theme } from "~/shared/constants"
import { useCustomMediaQuery, useCustomTranslation } from "~/shared/utils"

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
  const { greaterThanSM } = useCustomMediaQuery()

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
    <Box
      display="flex"
      flex={1}
      justifyContent="space-between"
      alignItems="center"
      margin="0 auto"
      padding={greaterThanSM ? "0px 24px" : "0px 16px"}
      maxWidth="900px">
      {(config.isBackShown && (
        <Button
          variant="outlined"
          onClick={onBackButtonClick}
          sx={{ borderRadius: "100px", padding: "10px 24px", width: greaterThanSM ? "200px" : "120px" }}>
          {t("Consent.back")}
        </Button>
      )) || <div></div>}

      {isLoading ? (
        <Button
          variant="contained"
          sx={{ borderRadius: "100px", padding: "10px 24px", width: greaterThanSM ? "200px" : "120px" }}
          disabled={isLoading}
          onClick={isSubmitShown ? onSubmitButtonClick : onNextButtonClick}>
          <CircularProgress size={25} sx={{ color: Theme.colors.light.onPrimary }} />
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ borderRadius: "100px", padding: "10px 24px", width: greaterThanSM ? "200px" : "120px" }}
          disabled={!config.isSkippable && config.isNextDisabled}
          onClick={isSubmitShown ? onSubmitButtonClick : onNextButtonClick}>
          {nextOrSubmitButtonLabel}
        </Button>
      )}
    </Box>
  )
}
