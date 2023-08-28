import { ActivityListItem } from "../../../lib"
import { ActivityAvailableLabel } from "./ActivityAvailableLabel"
import { ActivityFlowAvailableLabel } from "./ActivityFlowAvailableLabel"
import { ActivityFlowInProgressLabel } from "./ActivityFlowInProgressLabel"
import { ActivityInProgressLabel } from "./ActivityInProgressLabel"
import { ActivityUnsupportedLabel } from "./ActivityUnsupportedLabel"

type Props = {
  activityListItem: ActivityListItem
  isSupportedActivity: boolean
  isActivityInProgress: boolean
  countOfCompletedQuestions: number
  activityLength: number
}

export const ActivityLabel = (props: Props) => {
  const isFlow = Boolean(props.activityListItem.flowId)

  const getCompletedActivitiesFromPosition = (position: number) => {
    return position - 1
  }

  if (!props.isSupportedActivity) {
    return <ActivityUnsupportedLabel />
  }

  if (isFlow && props.isActivityInProgress) {
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

  if (!isFlow && props.isActivityInProgress) {
    return (
      <ActivityInProgressLabel
        activityLength={props.activityLength}
        countOfCompletedQuestions={props.countOfCompletedQuestions}
      />
    )
  }

  return <ActivityAvailableLabel activityLength={props.activityLength} />
}
