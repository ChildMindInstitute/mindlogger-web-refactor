import { ActivityAvailableLabel } from "./ActivityAvailableLabel"
import { ActivityInProgressLabel } from "./ActivityInProgressLabel"

type Props = {
  isActivityInProgress: boolean
  activityLength: number
  countOfCompletedQuestions: number
}

export const ActivityLabel = (props: Props) => {
  if (props.isActivityInProgress) {
    return (
      <ActivityInProgressLabel
        activityLength={props.activityLength}
        countOfCompletedQuestions={props.countOfCompletedQuestions}
      />
    )
  }

  return <ActivityAvailableLabel activityLength={props.activityLength} />
}
