import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"

import { Theme } from "~/shared/constants"
import { Text } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  width: string
  onClick: () => void
}

export const StartAssessmentButton = ({ width, onClick }: Props) => {
  const { t } = useCustomTranslation()

  return (
    <Box display="flex" flex={1} justifyContent="center">
      <ButtonBase
        onClick={onClick}
        sx={{
          padding: "10px 24px",
          backgroundColor: Theme.colors.light.primary,
          width,
          borderRadius: "100px",
        }}>
        <Text color={Theme.colors.light.onPrimary} fontSize="14px" fontWeight="700">
          {t("start")}
        </Text>
      </ButtonBase>
    </Box>
  )
}
