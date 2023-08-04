import Button from "@mui/material/ButtonBase"
import classNames from "classnames"

import { ActivityListItem, ActivityStatus, useSupportableActivity } from "../lib"
import { ActivityFlowStep } from "./ActivityFlowStep"
import { MobileOnlyLabel } from "./MobileOnlyLabel"
import TimeStatusLabel from "./TimeStatusLabel"

import { Theme } from "~/shared/constants"
import { Loader } from "~/shared/ui"

import "./style.scss"

interface ActivityCardProps {
  activity: ActivityListItem
  isPublic: boolean
  onActivityCardClick: () => void

  disabled?: boolean
}

export const ActivityCard = ({ activity, disabled, onActivityCardClick, isPublic }: ActivityCardProps) => {
  const { isSupportedActivity, isLoading } = useSupportableActivity({ activityId: activity.activityId, isPublic })

  const isDisabled = disabled || activity.status === ActivityStatus.Scheduled || !isSupportedActivity

  if (isLoading) {
    return (
      <Button
        className="ds-activity-button w-100"
        disabled={isLoading}
        sx={{ backgroundColor: Theme.colors.light.surface, border: `1px solid ${Theme.colors.light.surfaceVariant}` }}>
        <div className="activity-data">
          <Loader />
        </div>
      </Button>
    )
  }

  return (
    <Button
      className={classNames("ds-activity-button", "w-100")}
      disabled={isDisabled}
      onClick={onActivityCardClick}
      sx={{ backgroundColor: Theme.colors.light.surface }}>
      {activity.image && <img className="activity-image" src={activity.image} />}

      <div className="activity-data">
        {activity.isInActivityFlow && activity.activityFlowDetails!.showActivityFlowBadge && (
          <ActivityFlowStep
            position={activity.activityFlowDetails!.activityPositionInFlow}
            activityCount={activity.activityFlowDetails!.numberOfActivitiesInFlow}
            activityFlowName={activity.activityFlowDetails!.activityFlowName}
          />
        )}

        <div
          className={classNames(
            "activity-name-date",
            { "activity-title-active": !isDisabled },
            { "activity-title-disabled": isDisabled },
          )}>
          {activity.name}
        </div>

        {activity.description && <div className="activity-description">{activity.description}</div>}

        {isSupportedActivity && <TimeStatusLabel activity={activity} />}

        {!isSupportedActivity && <MobileOnlyLabel />}
      </div>
    </Button>
  )
}
