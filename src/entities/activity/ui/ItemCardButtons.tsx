import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"

import { Theme } from "~/shared/constants"
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
        <Button
          variant="outlined"
          onClick={onBackButtonClick}
          sx={{ borderRadius: "100px", padding: "10px 24px", width: greaterThanSM ? "200px" : "120px" }}>
          {t("Consent.back")}
        </Button>
      )) || <div></div>}

      <Button
        variant="contained"
        sx={{ borderRadius: "100px", padding: "10px 24px", width: greaterThanSM ? "200px" : "120px" }}
        disabled={isLoading}
        onClick={onNextButtonClick}>
        {isLoading ? (
          <CircularProgress size={25} sx={{ color: Theme.colors.light.onPrimary }} />
        ) : (
          nextOrSubmitButtonLabel
        )}
      </Button>
    </Box>
  )
}
