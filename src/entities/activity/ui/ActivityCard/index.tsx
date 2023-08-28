import { useMemo } from "react"

import Box from "@mui/material/Box"

import { ActivityListItem, ActivityStatus, useActivity } from "../../lib"
import { activityBuilder } from "../../model"
import { useActivityEventProgressState } from "../../model/hooks"
import { ActivityCardBase } from "./ActivityCardBase"
import { ActivityCardDescription } from "./ActivityCardDescription"
import { ActivityCardIcon } from "./ActivityCardIcon"
import { ActivityCardProgressBar } from "./ActivityCardProgressBar"
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

  const { activityEvents, progress } = useActivityEventProgressState({
    activityId: activityListItem.activityId,
    eventId: activityListItem.eventId,
  })

  const isActivityInProgress = activityListItem.status === ActivityStatus.InProgress

  const countOfCompletedQuestions = activityEvents.filter(item => item.answer.length).length

  const activityLength = activity?.items.length || 0

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

          {isActivityInProgress && <ActivityCardProgressBar percentage={progress} />}

          <ActivityLabel
            activityListItem={activityListItem}
            activityLength={activityLength}
            isSupportedActivity={isSupportedActivity}
            isActivityInProgress={isActivityInProgress}
            countOfCompletedQuestions={countOfCompletedQuestions}
          />

          <ActivityCardDescription description={activityListItem.description} />

          {isSupportedActivity && <TimeStatusLabel activity={activityListItem} />}
        </Box>
      </Box>
    </ActivityCardBase>
  )
}
