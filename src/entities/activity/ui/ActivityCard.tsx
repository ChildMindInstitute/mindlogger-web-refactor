import { Button } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"

import { ActivityListItem, ActivityStatus } from "../lib"
import TimeStatusLabel from "./TimeStatusLabel"

import { ROUTES } from "~/shared/utils"

import "./style.scss"

interface ActivityCardProps {
  activity: ActivityListItem
  disabled?: boolean
}

const ActivityCard = ({ activity, disabled }: ActivityCardProps) => {
  const navigate = useNavigate()
  const { appletId } = useParams()

  const isDisabled = disabled || activity.status === ActivityStatus.Scheduled

  const onActivityCardClick = () => {
    navigate(ROUTES.activityDetails.navigateTo(appletId!, activity.activityId))
  }

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
