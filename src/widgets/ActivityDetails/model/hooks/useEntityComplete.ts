import { activityModel } from "~/entities/activity"
import { AppletDetailsDTO } from "~/shared/api"
import { ROUTES } from "~/shared/constants"
import { useCustomNavigation } from "~/shared/utils"

type Props = {
  appletDetails: AppletDetailsDTO
  activityId: string
  eventId: string
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
      entityId: props.activityId,
      eventId: props.eventId,
    })
  }

  const flowCompleted = (flowId: string) => {
    completeEntity()

    const { activityFlows } = props.appletDetails

    const currentFlow = activityFlows.find(flow => flow.id === flowId)!

    const currentActivityIndexInFlow = currentFlow.activityIds.findIndex(activityId => activityId === props.activityId)!

    const nextActivityId = currentFlow.activityIds[currentActivityIndexInFlow + 1]

    flowUpdated({
      appletId: props.appletDetails.id,
      activityId: props.activityId,
      flowId: currentFlow.id,
      eventId: props.eventId,
      pipelineActivityOrder: nextActivityId ? currentActivityIndexInFlow + 1 : 0,
    })

    if (props.publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicActivityDetails.navigateTo({
          appletId: props.appletDetails.id,
          activityId: nextActivityId,
          eventId: props.eventId,
          entityType: "flow",
          publicAppletKey: props.publicAppletKey,
          flowId,
        }),
      )
    }

    return navigator.navigate(
      ROUTES.activityDetails.navigateTo({
        appletId: props.appletDetails.id,
        activityId: nextActivityId,
        eventId: props.eventId,
        entityType: "flow",
        flowId,
      }),
    )
  }

  const activityCompleted = () => {
    completeEntity()

    if (props.publicAppletKey) {
      return navigator.navigate(ROUTES.thanks.navigateTo(props.publicAppletKey, true))
    }

    return navigator.navigate(ROUTES.thanks.navigateTo(props.appletDetails.id, false))
  }

  return {
    activityCompleted,
    flowCompleted,
  }
}
