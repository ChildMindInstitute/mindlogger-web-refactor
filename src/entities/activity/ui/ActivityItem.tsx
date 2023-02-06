import { Button } from "react-bootstrap"

import { Activity } from "../lib"
import TimeStatusLabel from "./TimeStatusLabel"
import "./style.scss"

interface ActivityItemProps {
  activity: Activity
  disabled?: boolean
}

const ActivityItem = ({ activity, disabled }: ActivityItemProps) => {
  return (
    <Button
      className="button-shadow ds-activity-button w-100"
      variant="link"
      onClick={() => console.log(`onClick: ${activity.id}`)}
      disabled={disabled}>
      {activity.image && <img className="activity-image" src={activity.image} />}

      <div className="activity-data">
        <div className="activity-name-date">{activity.name}</div>

        {activity.description && <div className="activity-description">{activity.description.en}</div>}
        <TimeStatusLabel activity={activity} />
      </div>
    </Button>
  )
}

export default ActivityItem
