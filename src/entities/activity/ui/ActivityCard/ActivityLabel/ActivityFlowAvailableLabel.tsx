import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"

import { ActivityLabelTypography } from "./ActivityLabelTypography"

import DocumentsIcon from "~/assets/documents-icon.svg"
import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  activityFlowLength: number
}

export const ActivityFlowAvailableLabel = ({ activityFlowLength }: Props) => {
  const { t } = useCustomTranslation()

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="8px"
      sx={{
        padding: "4px 8px",
        borderRadius: "8px",
        backgroundColor: Theme.colors.light.primary95,
      }}>
      <Avatar src={DocumentsIcon} sx={{ width: "18px", height: "18px" }} />
      <ActivityLabelTypography
        text={t("activityFlowLength", {
          length: activityFlowLength,
        })}
        color={Theme.colors.light.onPrimaryContainer}
      />
    </Box>
  )
}
