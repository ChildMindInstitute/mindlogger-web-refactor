import { ActivityAvailableLabel } from "./ActivityAvailableLabel"
import { ActivityFlowAvailableLabel } from "./ActivityFlowAvailableLabel"
import { ActivityFlowInProgressLabel } from "./ActivityFlowInProgressLabel"
import { ActivityInProgressLabel } from "./ActivityInProgressLabel"
import { ActivityUnsupportedLabel } from "./ActivityUnsupportedLabel"

type Props = {
  isFlow: boolean

  isSupportedActivity: boolean
  isActivityInProgress: boolean
  countOfCompletedQuestions: number
  activityLength: number

  numberOfActivitiesInFlow: number
  countOfCompletedActivities: number
}

export const ActivityLabel = (props: Props) => {
  if (!props.isSupportedActivity) {
    return <ActivityUnsupportedLabel />
  }

  if (props.isFlow && props.isActivityInProgress) {
    return (
      <ActivityFlowInProgressLabel
        activityFlowLength={props.numberOfActivitiesInFlow}
        countOfCompletedActivities={props.countOfCompletedActivities}
      />
    )
  }

  if (props.isFlow) {
    return <ActivityFlowAvailableLabel activityFlowLength={props.numberOfActivitiesInFlow} />
  }

  if (!props.isFlow && props.isActivityInProgress) {
    return (
      <ActivityInProgressLabel
        activityLength={props.activityLength}
        countOfCompletedQuestions={props.countOfCompletedQuestions}
      />
    )
  }

  return <ActivityAvailableLabel activityLength={props.activityLength} />
}
