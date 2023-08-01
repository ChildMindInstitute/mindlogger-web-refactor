import { ActivityListItem } from "../lib"

type Props = {
  activity: ActivityListItem
}

export const ActivityFlowStep = ({ activity }: Props) => {
  const { activityPositionInFlow, numberOfActivitiesInFlow, activityFlowName } = activity.activityFlowDetails!

  return (
    <div className="activity-flow-badge">
      <p>{`(${activityPositionInFlow} of ${numberOfActivitiesInFlow}) ${activityFlowName}`}</p>
    </div>
  )
}
