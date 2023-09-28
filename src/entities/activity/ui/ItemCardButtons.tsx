import Box from "@mui/material/Box"

import { Theme } from "~/shared/constants"
import { BaseButton } from "~/shared/ui"
import { useCustomMediaQuery, useCustomTranslation } from "~/shared/utils"

type ItemCardButtonsProps = {
  isLoading: boolean
  isSubmitShown: boolean
  isBackShown: boolean

  onBackButtonClick?: () => void
  onNextButtonClick: () => void
}

export const ItemCardButton = ({
  isSubmitShown,
  isBackShown,
  onBackButtonClick,
  onNextButtonClick,
  isLoading,
}: ItemCardButtonsProps) => {
  const { t } = useCustomTranslation()
  const { greaterThanSM } = useCustomMediaQuery()

  const nextOrSubmitButtonLabel = isSubmitShown ? t("submit") : t("Consent.next")

  return (
    <Box
      display="flex"
      flex={1}
      justifyContent="space-between"
      alignItems="center"
      margin="0 auto"
      padding={greaterThanSM ? "0px 24px" : "0px 16px"}
      maxWidth="900px">
      {(isBackShown && (
        <Box width={greaterThanSM ? "200px" : "120px"}>
          <BaseButton
            type="button"
            variant="outlined"
            onClick={onBackButtonClick}
            text={t("Consent.back")}
            borderColor={Theme.colors.light.outline}
          />
        </Box>
      )) || <div></div>}

      <Box width={greaterThanSM ? "200px" : "120px"}>
        <BaseButton
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={onNextButtonClick}
          text={nextOrSubmitButtonLabel}
        />
      </Box>
    </Box>
  )
}
