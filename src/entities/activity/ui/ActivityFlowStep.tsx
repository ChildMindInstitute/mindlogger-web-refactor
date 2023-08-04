type Props = {
  position: number
  activityCount: number
  activityFlowName: string
}

export const ActivityFlowStep = ({ position, activityCount, activityFlowName }: Props) => {
  return (
    <div className="activity-flow-badge">
      <p className="activity-flow-label">{`(${position} of ${activityCount}) ${activityFlowName}`}</p>
    </div>
  )
}
