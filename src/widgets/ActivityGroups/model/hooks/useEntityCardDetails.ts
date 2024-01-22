import { ActivityListItem, ActivityStatus } from "../../lib"

import { isSupportedActivity } from "~/entities/activity"
import { AppletDetailsBaseInfoDTO } from "~/shared/api"

type Props = {
  applet: AppletDetailsBaseInfoDTO
  activityListItem: ActivityListItem
}

type Return = {
  title: string
  image: string | null

  isFlow: boolean
  isDisabled: boolean

  isScheduled: boolean
  isInProgress: boolean

  isEntitySupported: boolean
}

export const useEntityCardDetails = (props: Props): Return => {
  const isFlow = Boolean(props.activityListItem.flowId && props.activityListItem.activityFlowDetails)

  const activityFlowName = props.activityListItem.activityFlowDetails?.activityFlowName

  const entityName = isFlow && activityFlowName ? activityFlowName : props.activityListItem.name
  const entityImage = isFlow ? null : props.activityListItem.image

  const isScheduled = props.activityListItem.status === ActivityStatus.Scheduled
  const isInProgress = props.activityListItem.status === ActivityStatus.InProgress

  const flow = props.applet.activityFlows.find(flow => flow.id === props.activityListItem.flowId)

  const activitiesInFlow = props.applet.activities.filter(({ id }) => flow?.activityIds.includes(id))

  const isActivitySupported =
    props.activityListItem.containsResponseTypes && isSupportedActivity(props.activityListItem.containsResponseTypes)

  const isFlowSupported =
    isFlow &&
    activitiesInFlow &&
    activitiesInFlow.every(activity => isSupportedActivity(activity.containsResponseTypes))

  const isEntitySupported = isFlow ? isFlowSupported : Boolean(isActivitySupported)

  return {
    title: entityName,
    image: entityImage,
    isFlow,
    isDisabled: isScheduled,
    isScheduled,
    isInProgress,
    isEntitySupported,
  }
}
