import { ActivityPipelineType, activityModel } from "~/entities/activity"
import { AppletDetailsDTO } from "~/shared/api"
import { ROUTES } from "~/shared/constants"
import { useCustomNavigation } from "~/shared/utils"

type Props = {
  appletDetails: AppletDetailsDTO
  activityId: string
  eventId: string

  flowId: string | null
  publicAppletKey: string | null
}

export const useEntityComplete = (props: Props) => {
  const navigator = useCustomNavigation()
  const { clearActivityItemsProgressById } = activityModel.hooks.useActivityClearState()
  const { entityCompleted, flowUpdated } = activityModel.hooks.useActivityGroupsInProgressState()

  const { getGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()

  const completeActivityFlowAndRedirect = () => {
    entityCompleted({
      appletId: props.appletDetails.id,
      entityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    })

    if (props.publicAppletKey) {
      return navigator.navigate(ROUTES.thanks.navigateTo(props.publicAppletKey, true), { replace: true })
    }

    return navigator.navigate(ROUTES.thanks.navigateTo(props.appletDetails.id, false), { replace: true })
  }

  const redirectToNextActivity = (activityId: string) => {
    if (props.publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicActivityDetails.navigateTo({
          appletId: props.appletDetails.id,
          activityId,
          eventId: props.eventId,
          entityType: "flow",
          publicAppletKey: props.publicAppletKey,
          flowId: props.flowId,
        }),
        { replace: true },
      )
    }

    return navigator.navigate(
      ROUTES.activityDetails.navigateTo({
        appletId: props.appletDetails.id,
        activityId,
        eventId: props.eventId,
        entityType: "flow",
        flowId: props.flowId,
      }),
      { replace: true },
    )
  }

  const completeFlow = (flowId: string) => {
    const { activityFlows } = props.appletDetails

    const groupInProgress = getGroupInProgressByIds({
      appletId: props.appletDetails.id,
      activityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    })

    if (!groupInProgress) {
      return
    }

    const isFlow = groupInProgress.type === ActivityPipelineType.Flow

    if (!isFlow) {
      return
    }

    const currentPipelineActivityOrder = groupInProgress.pipelineActivityOrder

    const currentFlow = activityFlows.find(flow => flow.id === flowId)!

    const nextActivityId = currentFlow.activityIds[currentPipelineActivityOrder + 1]

    flowUpdated({
      appletId: props.appletDetails.id,
      activityId: nextActivityId ? nextActivityId : currentFlow.activityIds[0],
      flowId: currentFlow.id,
      eventId: props.eventId,
      pipelineActivityOrder: nextActivityId ? currentPipelineActivityOrder + 1 : 0,
    })

    clearActivityItemsProgressById(props.activityId, props.eventId)

    if (!nextActivityId) {
      return completeActivityFlowAndRedirect()
    }

    return redirectToNextActivity(nextActivityId)
  }

  const completeActivity = () => {
    clearActivityItemsProgressById(props.activityId, props.eventId)
    entityCompleted({
      appletId: props.appletDetails.id,
      entityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    })

    if (props.publicAppletKey) {
      return navigator.navigate(ROUTES.thanks.navigateTo(props.publicAppletKey, true), { replace: true })
    }

    return navigator.navigate(ROUTES.thanks.navigateTo(props.appletDetails.id, false), { replace: true })
  }

  return {
    completeActivity,
    completeFlow,
  }
}
