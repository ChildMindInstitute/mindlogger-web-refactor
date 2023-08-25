import Box from "@mui/material/Box"
import classNames from "classnames"

import { ActivityListItem, ActivityStatus, useSupportableActivity } from "../../lib"
import { ActivityCardBase } from "./ActivityCardBase"
import { ActivityFlowStep } from "./ActivityFlowStep"
import { MobileOnlyLabel } from "./MobileOnlyLabel"
import TimeStatusLabel from "./TimeStatusLabel"

import { AvatarBase, Loader } from "~/shared/ui"

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
      <ActivityCardBase>
        <div className="activity-data">
          <Loader />
        </div>
      </ActivityCardBase>
    )
  }

  return (
    <ActivityCardBase onClick={onActivityCardClick}>
      <Box display="flex" flex={1} gap="24px" data-testid="activity-card-content-wrapper">
        <Box display="flex" justifyContent="center" alignItems="center" width="64px">
          {activity.image && <AvatarBase src={activity.image} name="" width="64px" height="64px" />}
        </Box>

        <Box display="flex" flex={1} justifyContent="center" alignItems="flex-start" flexDirection="column">
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
        </Box>
      </Box>
    </ActivityCardBase>
  )
}
