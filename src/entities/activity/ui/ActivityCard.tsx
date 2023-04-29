import { Button } from "react-bootstrap"

import { ActivityListItem, ActivityStatus } from "../lib"
import TimeStatusLabel from "./TimeStatusLabel"

import "./style.scss"
import { DisableOverlay } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityCardProps {
  activity: ActivityListItem
  isSupported: boolean
  onActivityCardClick: () => void

  disabled?: boolean
}

export const ActivityCard = ({ activity, disabled, onActivityCardClick, isSupported }: ActivityCardProps) => {
  const { t } = useCustomTranslation()

  const isDisabled = disabled || activity.status === ActivityStatus.Scheduled || !isSupported

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
