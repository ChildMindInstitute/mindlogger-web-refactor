import { useContext } from "react"

import Box from "@mui/material/Box"

import { ActivityListItem, ActivityStatus, AppletDetailsContext } from "../../lib"
import { useStartEntity } from "../../model/hooks/useStartEntity"
import { ActivityCardBase } from "./ActivityCardBase"
import { ActivityCardDescription } from "./ActivityCardDescription"
import { ActivityCardIcon } from "./ActivityCardIcon"
import { ActivityCardProgressBar } from "./ActivityCardProgressBar"
import { ActivityCardTitle } from "./ActivityCardTitle"
import { ActivityLabel } from "./ActivityLabel"
import TimeStatusLabel from "./TimeStatusLabel"

import { getProgressId, openStoreLink } from "~/abstract/lib"
import { isSupportedActivity, useActivitiesByIds, useActivityByIdQuery } from "~/entities/activity"
import { appletModel } from "~/entities/applet"
import Loader from "~/shared/ui/Loader"
import { useAppSelector, useCustomMediaQuery } from "~/shared/utils"

type Props = {
  activityListItem: ActivityListItem
}

export const ActivityCard = ({ activityListItem }: Props) => {
  const { lessThanSM } = useCustomMediaQuery()

  const context = useContext(AppletDetailsContext)

  const isStatusScheduled = activityListItem.status === ActivityStatus.Scheduled

  const isDisabled = isStatusScheduled

  const isFlow = Boolean(activityListItem.flowId && activityListItem.activityFlowDetails)

  const activityFlowName = activityListItem.activityFlowDetails?.activityFlowName

  const isActivityInProgress = activityListItem.status === ActivityStatus.InProgress

  const activityEventId = getProgressId(activityListItem.activityId, activityListItem.eventId)

  const activityProgress = useAppSelector(state => appletModel.selectors.selectActivityProgress(state, activityEventId))

  const step = activityProgress?.step || 0

  const items = activityProgress?.items || []

  const progress = ((step + 1) / items.length) * 100

  const countOfCompletedQuestions = items.filter(item => item.answer.length).length || 0

  const numberOfActivitiesInFlow = activityListItem.activityFlowDetails?.numberOfActivitiesInFlow || 0

  const { startActivityOrFlow } = useStartEntity({
    applet: context.appletDetails,
    isPublic: context.isPublic,
    publicAppletKey: context.isPublic ? context.publicAppletKey : null,
  })

  const { data: activity, isLoading: activityLoading } = useActivityByIdQuery(
    { activityId: activityListItem.activityId, isPublic: context.isPublic },
    { select: data => data.data.result },
  )

  const flow = context.appletDetails?.activityFlows.find(flow => flow.id === activityListItem.flowId)

  const activityIdsInFlow = flow?.activityIds || []

  const { data: activities, isLoading: isFlowLoading } = useActivitiesByIds({ ids: activityIdsInFlow, enabled: isFlow })

  const getCompletedActivitiesFromPosition = (position: number) => position - 1

  const countOfCompletedActivities = getCompletedActivitiesFromPosition(
    activityListItem.activityFlowDetails?.activityPositionInFlow || 0,
  )

  const activityLength = activity?.items.length || 0

  const activityCardTitle = isFlow && activityFlowName ? activityFlowName : activityListItem.name

  const flowProgress = (countOfCompletedActivities / numberOfActivitiesInFlow) * 100

  const isActivitySupported = isSupportedActivity(activity)

  const isFlowSupported = activities?.every(activity => isSupportedActivity(activity))

  const isEntitySupported = isFlow ? isFlowSupported : isActivitySupported

  function onActivityCardClickHandler() {
    if (isDisabled || !activity) return

    if (!isEntitySupported) {
      return openStoreLink()
    }

    return startActivityOrFlow({
      activity,
      eventId: activityListItem.eventId,
      status: activityListItem.status,
      flowId: activityListItem.flowId,
    })
  }

  if (activityLoading || isFlowLoading) {
    return (
      <ActivityCardBase isFlow={isFlow}>
        <Loader />
      </ActivityCardBase>
    )
  }

  return (
    <ActivityCardBase onClick={onActivityCardClickHandler} isDisabled={isDisabled} isFlow={isFlow}>
      <Box
        display="flex"
        flex={1}
        gap={lessThanSM ? "8px" : "24px"}
        flexDirection={lessThanSM ? "column" : "row"}
        data-testid="activity-card-content-wrapper"
        sx={{ textTransform: "none" }}>
        <ActivityCardIcon src={isFlow ? null : activityListItem.image} isFlow={isFlow} />

        <Box display="flex" flex={1} justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
          <ActivityCardTitle title={activityCardTitle} isFlow={isFlow} />

          {isActivityInProgress && (
            <ActivityCardProgressBar percentage={isFlow ? flowProgress : progress} isFlow={isFlow} />
          )}

          <ActivityLabel
            isFlow={isFlow}
            activityLength={activityLength}
            isSupportedActivity={isEntitySupported}
            isActivityInProgress={isActivityInProgress}
            countOfCompletedQuestions={countOfCompletedQuestions}
            countOfCompletedActivities={countOfCompletedActivities}
            numberOfActivitiesInFlow={numberOfActivitiesInFlow}
          />

          <ActivityCardDescription description={activityListItem.description} isFlow={isFlow} />

          {isEntitySupported && <TimeStatusLabel activity={activityListItem} />}
        </Box>
      </Box>
    </ActivityCardBase>
  )
}
