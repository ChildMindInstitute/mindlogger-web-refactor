import { useMemo } from "react"

import Box from "@mui/material/Box"

import { ActivityListItem, ActivityStatus, useActivity } from "../../lib"
import { activityBuilder } from "../../model"
import { useActivityEventProgressState } from "../../model/hooks"
import { ActivityCardBase } from "./ActivityCardBase"
import { ActivityCardDescription } from "./ActivityCardDescription"
import { ActivityCardIcon } from "./ActivityCardIcon"
import { ActivityCardTitle } from "./ActivityCardTitle"
import { ActivityLabel } from "./ActivityLabel"
import { MobileOnlyLabel } from "./MobileOnlyLabel"
import TimeStatusLabel from "./TimeStatusLabel"

import { Loader } from "~/shared/ui"

interface ActivityCardProps {
  activityListItem: ActivityListItem
  isPublic: boolean
  onActivityCardClick: () => void

  disabled?: boolean
}

export const ActivityCard = ({ activityListItem, disabled, onActivityCardClick, isPublic }: ActivityCardProps) => {
  const { isLoading, activity } = useActivity({
    activityId: activityListItem.activityId,
    isPublic,
  })

  const { activityEvents } = useActivityEventProgressState({
    activityId: activityListItem.activityId,
    eventId: activityListItem.eventId,
  })

  const countOfCompletedQuestions = activityEvents.filter(item => item.answer.length).length

  const isSupportedActivity = useMemo(() => {
    return activityBuilder.isSupportedActivity(activity)
  }, [activity])

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
    <ActivityCardBase onClick={onActivityCardClick}>
      <Box
        display="flex"
        flex={1}
        gap="24px"
        data-testid="activity-card-content-wrapper"
        sx={{ textTransform: "none" }}>
        <ActivityCardIcon src={activityListItem.image} isFlow={Boolean(activityListItem.flowId)} />

        <Box display="flex" flex={1} justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
          {/* {activity.isInActivityFlow && activity.activityFlowDetails!.showActivityFlowBadge && (
            <ActivityFlowStep
              position={activity.activityFlowDetails!.activityPositionInFlow}
              activityCount={activity.activityFlowDetails!.numberOfActivitiesInFlow}
              activityFlowName={activity.activityFlowDetails!.activityFlowName}
            />
          )} */}

          <ActivityCardTitle title={activityListItem.name} />

          <ActivityLabel
            isActivityInProgress={activityListItem.status === ActivityStatus.InProgress}
            activityLength={activity?.items.length || 0}
            countOfCompletedQuestions={countOfCompletedQuestions}
          />

          <ActivityCardDescription description={activityListItem.description} />

          {isSupportedActivity && <TimeStatusLabel activity={activityListItem} />}

          {!isSupportedActivity && <MobileOnlyLabel />}
        </Box>
      </Box>
    </ActivityCardBase>
  )
}
