import { Typography } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"

import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  onClick: () => void
  asLink?: boolean
}

export const SaveAndExitButton = ({ onClick, asLink }: Props) => {
  const { t } = useCustomTranslation()

  const buttonStyles = asLink
    ? {}
    : {
        padding: "10px 24px",
        backgroundColor: Theme.colors.light.secondaryContainer,
        borderRadius: "100px",
      }

  const buttonLabelColor = asLink ? Theme.colors.light.primary : Theme.colors.light.onSecondaryContainer

  return (
    <ButtonBase onClick={onClick} sx={{ ...buttonStyles }}>
      <Typography variant="body1" color={buttonLabelColor} fontSize="14px">
        {t("save_and_exit")}
      </Typography>
    </ButtonBase>
  )
}
