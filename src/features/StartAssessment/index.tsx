import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"

import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

export const StartAssessmentButton = () => {
  const { t } = useCustomTranslation()

  return (
    <ButtonBase
      sx={{
        padding: "10px 24px",
        backgroundColor: Theme.colors.light.primary,
        width: "375px",
        borderRadius: "100px",
      }}>
      <Typography variant="body1" color={Theme.colors.light.onPrimary} fontSize="14px" fontWeight="700">
        {t("start")}
      </Typography>
    </ButtonBase>
  )
}
