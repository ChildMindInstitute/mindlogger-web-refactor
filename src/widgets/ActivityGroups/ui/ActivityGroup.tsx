import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { ActivityListGroup } from "../lib/types"

import { ActivityList, ActivityListItem } from "~/entities/activity"
import { Theme } from "~/shared/constants"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityGroupProps {
  group: ActivityListGroup
  isPublic: boolean
  onActivityCardClick: (activity: ActivityListItem) => void
}

export const ActivityGroup = ({ group, onActivityCardClick, isPublic }: ActivityGroupProps) => {
  const { t } = useCustomTranslation()

  return (
    <Box data-testid={`${group.name}-block`}>
      <Typography
        variant="h3"
        color={Theme.colors.light.onSurface}
        sx={{
          marginTop: "24px",
          marginBottom: "16px",
          fontFamily: "Atkinson",
          fontSize: "22px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "28px",
        }}>
        {t(group.name)}
      </Typography>

      <ActivityList activities={group.activities} onActivityCardClick={onActivityCardClick} isPublic={isPublic} />
    </Box>
  )
}
