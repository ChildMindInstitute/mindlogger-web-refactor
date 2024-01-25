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
  description: string | null

  isFlow: boolean
  showActivityFlowBudget: boolean
  isDisabled: boolean

  isScheduled: boolean
  isInProgress: boolean

  isEntitySupported: boolean
}

export const useEntityCardDetails = (props: Props): Return => {
  const isFlow = Boolean(props.activityListItem.flowId && props.activityListItem.activityFlowDetails)

  const flow = props.applet.activityFlows.find(flow => flow.id === props.activityListItem.flowId)

  const showActivityFlowBudget = Boolean(props.activityListItem.activityFlowDetails?.showActivityFlowBadge)

  const flowName = props.activityListItem.activityFlowDetails?.activityFlowName ?? null
  const flowDescription = flow ? flow.description : null
  const flowImage = flow ? flow.image : null

  const activityName = props.activityListItem.name
  const activityDescription = props.activityListItem.description
  const activityImage = props.activityListItem.image

  const showFlowDetails = isFlow && showActivityFlowBudget && flowName

  const entityName = showFlowDetails ? flowName : activityName
  const entityImage = showFlowDetails ? flowImage : activityImage
  const entityDescription = showFlowDetails ? flowDescription : activityDescription

  const isScheduled = props.activityListItem.status === ActivityStatus.Scheduled
  const isInProgress = props.activityListItem.status === ActivityStatus.InProgress

  const activity = props.applet.activities.find(activity => activity.id === props.activityListItem.activityId) ?? null

  const activitiesInFlow = props.applet.activities.filter(({ id }) => flow?.activityIds.includes(id))

  const isActivitySupported = activity && isSupportedActivity(activity.containsResponseTypes)

  const isFlowSupported =
    isFlow &&
    activitiesInFlow &&
    activitiesInFlow.every(activity => isSupportedActivity(activity.containsResponseTypes))

  const isEntitySupported = isFlow ? isFlowSupported : Boolean(isActivitySupported)

  return {
    title: entityName,
    image: entityImage,
    description: entityDescription,
    isFlow,
    showActivityFlowBudget,
    isDisabled: isScheduled,
    isScheduled,
    isInProgress,
    isEntitySupported,
  }
}
