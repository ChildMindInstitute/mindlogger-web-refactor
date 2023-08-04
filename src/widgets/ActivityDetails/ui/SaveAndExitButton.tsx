import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"

import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  onClick: () => void
}

export const SaveAndExitButton = ({ onClick }: Props) => {
  const { t } = useCustomTranslation()

  return (
    <Box position="absolute" top={0} right={32} height="100%" display="flex" alignItems="center">
      <ButtonBase
        onClick={onClick}
        sx={{
          padding: "10px 24px",
          backgroundColor: Theme.colors.light.secondaryContainer,
          borderRadius: "100px",
        }}>
        <Typography variant="body1" color={Theme.colors.light.onSecondaryContainer} fontSize="14px">
          {t("save_and_exit")}
        </Typography>
      </ButtonBase>
    </Box>
  )
}
