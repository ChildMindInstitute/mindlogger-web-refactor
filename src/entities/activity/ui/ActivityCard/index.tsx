import { useMemo } from "react"

import Box from "@mui/material/Box"

import { ActivityListItem, useActivity } from "../../lib"
import { activityBuilder } from "../../model"
import { ActivityCardBase } from "./ActivityCardBase"
import { ActivityCardDescription } from "./ActivityCardDescription"
import { ActivityCardIcon } from "./ActivityCardIcon"
import { ActivityCardTitle } from "./ActivityCardTitle"
import { ActivityLabel } from "./ActivityLabel"
import TimeStatusLabel from "./TimeStatusLabel"

import { Loader } from "~/shared/ui"

interface ActivityCardProps {
  activityListItem: ActivityListItem
  isPublic: boolean
  onActivityCardClick: () => void

  disabled?: boolean
}

export const ActivityCard = ({ activityListItem, onActivityCardClick, isPublic }: ActivityCardProps) => {
  const { isLoading, activity } = useActivity({
    activityId: activityListItem.activityId,
    isPublic,
  })

  const isSupportedActivity = useMemo(() => {
    return activityBuilder.isSupportedActivity(activity)
  }, [activity])

  const onActivityCardClickHandler = () => {
    if (!isSupportedActivity) {
      return
    }

    return onActivityCardClick()
  }

  if (isLoading) {
    return (
      <ActivityCardBase>
        <div className="activity-data">
          <Loader />
        </div>
      </ActivityCardBase>
    )
  }

  return (
    <ActivityCardBase onClick={onActivityCardClickHandler}>
      <Box
        display="flex"
        flex={1}
        gap="24px"
        data-testid="activity-card-content-wrapper"
        sx={{ textTransform: "none" }}>
        <ActivityCardIcon src={activityListItem.image} isFlow={Boolean(activityListItem.flowId)} />

        <Box display="flex" flex={1} justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
          <ActivityCardTitle title={activityListItem.name} />

          <ActivityLabel
            activityListItem={activityListItem}
            activity={activity}
            isSupportedActivity={isSupportedActivity}
          />

          <ActivityCardDescription description={activityListItem.description} />

          {isSupportedActivity && <TimeStatusLabel activity={activityListItem} />}
        </Box>
      </Box>
    </ActivityCardBase>
  )
}
