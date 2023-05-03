import { Button } from "react-bootstrap"

import { ActivityListItem, ActivityStatus, useSupportableActivity } from "../lib"
import TimeStatusLabel from "./TimeStatusLabel"

import "./style.scss"
import { DisableOverlay, Loader } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityCardProps {
  activity: ActivityListItem
  onActivityCardClick: () => void

  disabled?: boolean
}

export const ActivityCard = ({ activity, disabled, onActivityCardClick }: ActivityCardProps) => {
  const { t } = useCustomTranslation()
  const { isSupportedActivity, isError, isLoading } = useSupportableActivity({ activityId: activity.activityId })

  const isDisabled = disabled || activity.status === ActivityStatus.Scheduled || !isSupportedActivity

  if (isLoading) {
    return (
      <Button className="ds-activity-button w-100" variant="link" disabled={isLoading}>
        <div className="activity-data">
          <Loader />
        </div>
      </Button>
    )
  }

  return (
    <DisableOverlay message={t("mobileOnly")} isDisabled={isDisabled}>
      <Button className="ds-activity-button w-100" variant="link" onClick={onActivityCardClick} disabled={isDisabled}>
        {activity.image && <img className="activity-image" src={activity.image} />}
        <div className="activity-data">
          <div className="activity-name-date">{activity.name}</div>

          {activity.description && <div className="activity-description">{activity.description}</div>}
          <TimeStatusLabel activity={activity} />
        </div>
      </Button>
    </DisableOverlay>
  )
}
