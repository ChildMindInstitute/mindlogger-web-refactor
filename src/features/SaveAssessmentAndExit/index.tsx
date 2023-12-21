import ButtonBase from "@mui/material/ButtonBase"

import { Theme } from "~/shared/constants"
import { Text } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  onClick: () => void
}

export const SaveAndExitButton = ({ onClick }: Props) => {
  const { t } = useCustomTranslation()

  return (
    <ButtonBase onClick={onClick} data-testid="assessment-save-and-exit-button">
      <Text variant="body1" color={Theme.colors.light.primary} fontSize="16px">
        {t("save_and_exit")}
      </Text>
    </ButtonBase>
  )
}
