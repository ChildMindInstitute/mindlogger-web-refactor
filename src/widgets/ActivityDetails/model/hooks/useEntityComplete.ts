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

  const flowCompleted = () => {
    clearActivityItemsProgressById(props.activityId, props.eventId)

    const { activityFlows } = props.appletDetails

    const currentFlow = activityFlows.find(flow => flow.id === props.flowId)!

    const currentActivityIndexInFlow = currentFlow.activityIds.findIndex(activityId => activityId === props.activityId)!

    const nextActivityId = currentFlow.activityIds[currentActivityIndexInFlow + 1]

    flowUpdated({
      appletId: props.appletDetails.id,
      activityId: nextActivityId ? nextActivityId : currentFlow.activityIds[0],
      flowId: currentFlow.id,
      eventId: props.eventId,
      pipelineActivityOrder: nextActivityId ? currentActivityIndexInFlow + 1 : 0,
    })

    if (!nextActivityId) {
      entityCompleted({
        appletId: props.appletDetails.id,
        entityId: props.flowId ? props.flowId : props.activityId,
        eventId: props.eventId,
      })

      if (props.publicAppletKey) {
        return navigator.navigate(ROUTES.thanks.navigateTo(props.publicAppletKey, true))
      }

      return navigator.navigate(ROUTES.thanks.navigateTo(props.appletDetails.id, false))
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
    )
  }

  const activityCompleted = () => {
    clearActivityItemsProgressById(props.activityId, props.eventId)
    entityCompleted({
      appletId: props.appletDetails.id,
      entityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    })

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
