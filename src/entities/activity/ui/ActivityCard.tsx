import { Button } from "react-bootstrap"

import { ActivityListItem, ActivityStatus } from "../lib"
import TimeStatusLabel from "./TimeStatusLabel"

import "./style.scss"

interface ActivityCardProps {
  activity: ActivityListItem
  disabled?: boolean
  onActivityCardClick: () => void
}

const ActivityCard = ({ activity, disabled, onActivityCardClick }: ActivityCardProps) => {
  const isDisabled = disabled || activity.status === ActivityStatus.Scheduled

  return (
    <Button className="ds-activity-button w-100" variant="link" onClick={onActivityCardClick} disabled={isDisabled}>
      {activity.image && <img className="activity-image" src={activity.image} />}

      <div className="activity-data">
        <div className="activity-name-date">{activity.name}</div>

        {activity.description && <div className="activity-description">{activity.description}</div>}
        <TimeStatusLabel activity={activity} />
      </div>
    </Button>
  )
}

export default ActivityCard
