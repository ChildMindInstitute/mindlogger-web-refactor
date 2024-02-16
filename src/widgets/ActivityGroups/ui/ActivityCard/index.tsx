import { useContext } from "react"

import Box from "@mui/material/Box"

import { ActivityCardBase } from "./ActivityCardBase"
import { ActivityCardDescription } from "./ActivityCardDescription"
import { ActivityCardIcon } from "./ActivityCardIcon"
import { ActivityCardProgressBar } from "./ActivityCardProgressBar"
import { ActivityCardRestartResume } from "./ActivityCardRestartResume"
import { ActivityCardTitle } from "./ActivityCardTitle"
import { ActivityLabel } from "./ActivityLabel"
import TimeStatusLabel from "./TimeStatusLabel"
import { ActivityListItem, AppletDetailsContext } from "../../lib"
import { useEntityCardDetails } from "../../model/hooks"
import { useStartEntity } from "../../model/hooks/useStartEntity"

import { getProgressId, openStoreLink } from "~/abstract/lib"
import { useActivityByIdMutation } from "~/entities/activity"
import { appletModel } from "~/entities/applet"
import Loader from "~/shared/ui/Loader"
import { useAppSelector, useCustomMediaQuery } from "~/shared/utils"

type Props = {
  activityListItem: ActivityListItem
}

export const ActivityCard = ({ activityListItem }: Props) => {
  const { lessThanSM } = useCustomMediaQuery()

  const context = useContext(AppletDetailsContext)

  const { title, image, description, isFlow, showActivityFlowBudget, isDisabled, isInProgress, isEntitySupported } =
    useEntityCardDetails({
      activityListItem,
      applet: context.applet,
    })

  const activityEventId = getProgressId(activityListItem.activityId, activityListItem.eventId)

  const activityProgress = useAppSelector(state => appletModel.selectors.selectActivityProgress(state, activityEventId))

  const step = activityProgress?.step || 0

  const items = activityProgress?.items || []

  const progress = ((step + 1) / items.length) * 100

  const countOfCompletedQuestions = items.filter(item => item.answer.length).length || 0

  const numberOfActivitiesInFlow = activityListItem.activityFlowDetails?.numberOfActivitiesInFlow || 0

  const { startActivityOrFlow } = useStartEntity({
    applet: context.applet,
    isPublic: context.isPublic,
    publicAppletKey: context.isPublic ? context.publicAppletKey : null,
  })

  const { mutate: getActivityById, isLoading } = useActivityByIdMutation({ isPublic: context.isPublic })

  const getCompletedActivitiesFromPosition = (position: number) => position - 1

  const countOfCompletedActivities = getCompletedActivitiesFromPosition(
    activityListItem.activityFlowDetails?.activityPositionInFlow || 0,
  )

  const activityLength = context.applet?.activities.find(act => act.id === activityListItem.activityId)?.itemCount

  const flowProgress = (countOfCompletedActivities / numberOfActivitiesInFlow) * 100

  function onStartActivity(shouldRestart: boolean) {
    if (isDisabled || !activityListItem) return

    if (!isEntitySupported) {
      return openStoreLink()
    }

    return getActivityById(
      { activityId: activityListItem.activityId },
      {
        onSuccess(data) {
          const activity = data.data.result

          if (!activity) {
            throw new Error("[useActivityByIdMutation]: Activity not found")
          }

          return startActivityOrFlow({
            activity,
            eventId: activityListItem.eventId,
            status: activityListItem.status,
            flowId: activityListItem.flowId,
            shouldRestart,
          })
        },
      },
    )
  }

  const restartActivity = () => onStartActivity(true)
  const resumeActivity = () => onStartActivity(false)

  if (isLoading) {
    return (
      <ActivityCardBase isDisabled={isDisabled} isFlow={isFlow}>
        <Loader />
      </ActivityCardBase>
    )
  }

  return (
    <ActivityCardBase isDisabled={isDisabled} isFlow={isFlow}>
      <Box
        display="flex"
        flex={1}
        gap={lessThanSM ? "8px" : "24px"}
        flexDirection={lessThanSM ? "column" : "row"}
        data-testid="activity-card-content-wrapper"
        sx={{ textTransform: "none" }}>
        <ActivityCardIcon src={image} isFlow={isFlow} />

        <Box display="flex" flex={1} justifyContent="center" alignItems="flex-start" flexDirection="column" gap="8px">
          <ActivityCardTitle title={title} isFlow={isFlow} />

          {isInProgress && (
            <ActivityCardProgressBar
              percentage={isFlow && showActivityFlowBudget ? flowProgress : progress}
              isFlow={isFlow}
            />
          )}

          <ActivityLabel
            isFlow={isFlow && showActivityFlowBudget}
            activityLength={activityLength ?? 0}
            isSupportedActivity={isEntitySupported}
            isActivityInProgress={isInProgress}
            countOfCompletedQuestions={countOfCompletedQuestions}
            countOfCompletedActivities={countOfCompletedActivities}
            numberOfActivitiesInFlow={numberOfActivitiesInFlow}
          />

          {description && <ActivityCardDescription description={description} isFlow={isFlow} />}

          {isEntitySupported && <TimeStatusLabel activity={activityListItem} />}
        </Box>
        <ActivityCardRestartResume
          activityStatus={activityListItem.status}
          onRestartClick={restartActivity}
          onResumeClick={resumeActivity}
          activityName={title}
          isDisabled={isDisabled}
        />
      </Box>
    </ActivityCardBase>
  )
}
