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
import { useCustomMediaQuery } from "~/shared/utils"

interface ActivityCardProps {
  activityListItem: ActivityListItem
  isPublic: boolean
  onActivityCardClick: () => void
}

export const ActivityCard = ({ activityListItem, onActivityCardClick, isPublic }: ActivityCardProps) => {
  const { lessThanSM } = useCustomMediaQuery()

  const { isLoading, activity } = useActivity({
    activityId: activityListItem.activityId,
    isPublic,
  })

  const { activityEvents, progress } = useActivityEventProgressState({
    activityId: activityListItem.activityId,
    eventId: activityListItem.eventId,
  })

  const getCompletedActivitiesFromPosition = (position: number) => {
    return position - 1
  }

  const isStatusScheduled = activityListItem.status === ActivityStatus.Scheduled

  const isDisabled = isStatusScheduled

  const isFlow = Boolean(activityListItem.flowId)
  const activityFlowName = activityListItem.activityFlowDetails?.activityFlowName

  const isActivityInProgress = activityListItem.status === ActivityStatus.InProgress

  const countOfCompletedQuestions = activityEvents.filter(item => item.answer.length).length

  const activityLength = activity?.items.length || 0

  const numberOfActivitiesInFlow = activityListItem.activityFlowDetails?.numberOfActivitiesInFlow || 0

  const countOfCompletedActivities = getCompletedActivitiesFromPosition(
    activityListItem.activityFlowDetails?.activityPositionInFlow || 0,
  )

  const activityCardTitle = isFlow && activityFlowName ? activityFlowName : activityListItem.name

  const flowProgress = (countOfCompletedActivities / numberOfActivitiesInFlow) * 100

  const isSupportedActivity = useMemo(() => {
    return activityBuilder.isSupportedActivity(activity)
  }, [activity])

  const onActivityCardClickHandler = () => {
    if (!isSupportedActivity || isDisabled) {
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
    <ActivityCardBase onClick={onActivityCardClickHandler} isDisabled={isDisabled}>
      <Box
        display="flex"
        flex={1}
        gap={lessThanSM ? "8px" : "24px"}
        flexDirection={lessThanSM ? "column" : "row"}
        data-testid="activity-card-content-wrapper"
        sx={{ textTransform: "none" }}>
        <ActivityCardIcon src={isFlow ? null : activityListItem.image} isFlow={isFlow} />

        <Box display="flex" flex={1} justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
          <ActivityCardTitle title={activityCardTitle} />

          {isActivityInProgress && <ActivityCardProgressBar percentage={isFlow ? flowProgress : progress} />}

          <ActivityLabel
            isFlow={isFlow}
            activityLength={activityLength}
            isSupportedActivity={isSupportedActivity}
            isActivityInProgress={isActivityInProgress}
            countOfCompletedQuestions={countOfCompletedQuestions}
            countOfCompletedActivities={countOfCompletedActivities}
            numberOfActivitiesInFlow={numberOfActivitiesInFlow}
          />

          <ActivityCardDescription description={activityListItem.description} />

          {isSupportedActivity && <TimeStatusLabel activity={activityListItem} />}
        </Box>
      </Box>
    </ActivityCardBase>
  )
}