import Box from "@mui/material/Box"

import { ActivityListItem, ActivityStatus, useSupportableActivity } from "../../lib"
import { ActivityCardBase } from "./ActivityCardBase"
import { ActivityCardDescription } from "./ActivityCardDescription"
import { ActivityCardIcon } from "./ActivityCardIcon"
import { ActivityCardTitle } from "./ActivityCardTitle"
import { MobileOnlyLabel } from "./MobileOnlyLabel"
import TimeStatusLabel from "./TimeStatusLabel"

import { Loader } from "~/shared/ui"

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
      <Box
        display="flex"
        flex={1}
        gap="24px"
        data-testid="activity-card-content-wrapper"
        sx={{ textTransform: "none" }}>
        <ActivityCardIcon src={activity.image} isFlow={Boolean(activity.flowId)} />

        <Box display="flex" flex={1} justifyContent="center" alignItems="flex-start" flexDirection="column">
          {/* {activity.isInActivityFlow && activity.activityFlowDetails!.showActivityFlowBadge && (
            <ActivityFlowStep
              position={activity.activityFlowDetails!.activityPositionInFlow}
              activityCount={activity.activityFlowDetails!.numberOfActivitiesInFlow}
              activityFlowName={activity.activityFlowDetails!.activityFlowName}
            />
          )} */}

          <ActivityCardTitle title={activity.name} />
          <ActivityCardDescription description={activity.description} />

          {isSupportedActivity && <TimeStatusLabel activity={activity} />}

          {!isSupportedActivity && <MobileOnlyLabel />}
        </Box>
      </Box>
    </ActivityCardBase>
  )
}
