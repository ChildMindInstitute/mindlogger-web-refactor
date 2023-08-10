import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"

import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  width: string
}

export const StartAssessmentButton = ({ width }: Props) => {
  const { t } = useCustomTranslation()

  return (
    <Box display="flex" flex={1} justifyContent="center">
      <ButtonBase
        sx={{
          padding: "10px 24px",
          backgroundColor: Theme.colors.light.primary,
          width,
          borderRadius: "100px",
        }}>
        <Typography variant="body1" color={Theme.colors.light.onPrimary} fontSize="14px" fontWeight="700">
          {t("start")}
        </Typography>
      </ButtonBase>
    </Box>
  )
}
