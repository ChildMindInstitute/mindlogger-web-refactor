import { activityModel } from "~/entities/activity"
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

  const completeEntity = () => {
    clearActivityItemsProgressById(props.activityId, props.eventId)
    entityCompleted({
      appletId: props.appletDetails.id,
      entityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    })
  }

  const navigateToAppletDetails = () => {
    const entityCompletedState = {
      isAnswersSubmitted: true,
    }

    if (props.publicAppletKey) {
      return navigator.navigate(ROUTES.publicJoin.navigateTo(props.appletDetails.id), { state: entityCompletedState })
    }

    return navigator.navigate(ROUTES.activityList.navigateTo(props.appletDetails.id), { state: entityCompletedState })
  }

  const flowCompleted = (flowId: string) => {
    const { activityFlows } = props.appletDetails

    const currentFlow = activityFlows.find(flow => flow.id === flowId)!

    const currentActivityIndexInFlow = currentFlow.activityIds.findIndex(activityId => activityId === props.activityId)!

    const nextActivityId = currentFlow.activityIds[currentActivityIndexInFlow + 1]

    flowUpdated({
      appletId: props.appletDetails.id,
      activityId: nextActivityId ? nextActivityId : currentFlow.activityIds[0],
      flowId: currentFlow.id,
      eventId: props.eventId,
      pipelineActivityOrder: nextActivityId ? currentActivityIndexInFlow + 1 : 0,
    })

    clearActivityItemsProgressById(props.activityId, props.eventId)

    if (!nextActivityId) {
      entityCompleted({
        appletId: props.appletDetails.id,
        entityId: props.flowId ? props.flowId : props.activityId,
        eventId: props.eventId,
      })

      return navigateToAppletDetails()
    }

    const locationState = {
      isAnswersSubmitted: true,
    }

    if (props.publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicActivityDetails.navigateTo({
          appletId: props.appletDetails.id,
          activityId: nextActivityId,
          eventId: props.eventId,
          entityType: "flow",
          publicAppletKey: props.publicAppletKey,
          flowId: props.flowId,
        }),
        { state: locationState },
      )
    }

    return navigator.navigate(
      ROUTES.activityDetails.navigateTo({
        appletId: props.appletDetails.id,
        activityId: nextActivityId,
        eventId: props.eventId,
        entityType: "flow",
        flowId: props.flowId,
      }),
      { state: locationState },
    )
  }

  const activityCompleted = () => {
    completeEntity()

    return navigateToAppletDetails()
  }

  return {
    activityCompleted,
    flowCompleted,
  }
}
