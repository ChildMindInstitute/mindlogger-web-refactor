import { ActivityListItem, ActivityStatus } from "../../../lib"
import { useActivityEventProgressState } from "../../../model/hooks"
import { ActivityAvailableLabel } from "./ActivityAvailableLabel"
import { ActivityFlowAvailableLabel } from "./ActivityFlowAvailableLabel"
import { ActivityFlowInProgressLabel } from "./ActivityFlowInProgressLabel"
import { ActivityInProgressLabel } from "./ActivityInProgressLabel"
import { ActivityUnsupportedLabel } from "./ActivityUnsupportedLabel"

import { ActivityDTO } from "~/shared/api"

type Props = {
  activityListItem: ActivityListItem
  activity?: ActivityDTO
  isSupportedActivity: boolean
}

export const ActivityLabel = (props: Props) => {
  const isFlow = Boolean(props.activityListItem.flowId)
  const isActivityInProgress = props.activityListItem.status === ActivityStatus.InProgress
  const activityLength = props.activity?.items.length || 0

  const { activityEvents } = useActivityEventProgressState({
    activityId: props.activityListItem.activityId,
    eventId: props.activityListItem.eventId,
  })

  const countOfCompletedQuestions = activityEvents.filter(item => item.answer.length).length

  const getCompletedActivitiesFromPosition = (position: number) => {
    return position - 1
  }

  if (!props.isSupportedActivity) {
    return <ActivityUnsupportedLabel />
  }

  if (isFlow && isActivityInProgress) {
    return (
      <ActivityFlowInProgressLabel
        activityFlowLength={props.activityListItem.activityFlowDetails!.numberOfActivitiesInFlow}
        countOfCompletedActivities={getCompletedActivitiesFromPosition(
          props.activityListItem.activityFlowDetails!.activityPositionInFlow,
        )}
      />
    )
  }

  if (isFlow) {
    return (
      <ActivityFlowAvailableLabel
        activityFlowLength={props.activityListItem.activityFlowDetails!.numberOfActivitiesInFlow}
      />
    )
  }

  if (!isFlow && isActivityInProgress) {
    return (
      <ActivityInProgressLabel activityLength={activityLength} countOfCompletedQuestions={countOfCompletedQuestions} />
    )
  }

  return <ActivityAvailableLabel activityLength={activityLength} />
}
