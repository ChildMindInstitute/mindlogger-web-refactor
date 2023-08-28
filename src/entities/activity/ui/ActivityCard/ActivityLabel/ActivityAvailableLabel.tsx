import Box from "@mui/material/Box"

import { ActivityLabelTypography } from "./ActivityLabelTypography"

import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  activityLength: number
}

export const ActivityAvailableLabel = (props: Props) => {
  const { t } = useCustomTranslation()

  return (
    <Box
      sx={{
        padding: "4px 8px",
        borderRadius: "8px",
        backgroundColor: Theme.colors.light.primary95,
      }}>
      <ActivityLabelTypography
        text={t("question_count", { length: props.activityLength })}
        color={Theme.colors.light.onPrimaryContainer}
      />
    </Box>
  )
}
