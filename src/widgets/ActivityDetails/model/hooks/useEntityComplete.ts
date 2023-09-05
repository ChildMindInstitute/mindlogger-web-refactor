import { ActivityPipelineType, activityModel } from "~/entities/activity"
import { AppletDetailsDTO } from "~/shared/api"
import { ROUTES } from "~/shared/constants"
import { useToast } from "~/shared/ui"
import { useCustomNavigation, useCustomTranslation } from "~/shared/utils"

type Props = {
  appletDetails: AppletDetailsDTO
  activityId: string
  eventId: string

  flowId: string | null
  publicAppletKey: string | null
}

export const useEntityComplete = (props: Props) => {
  const navigator = useCustomNavigation()
  const { t } = useCustomTranslation()

  const { clearActivityItemsProgressById } = activityModel.hooks.useActivityClearState()
  const { entityCompleted, flowUpdated } = activityModel.hooks.useActivityGroupsInProgressState()

  const { getGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()

  const { showToast } = useToast()

  const completeEntityAndRedirect = () => {
    entityCompleted({
      appletId: props.appletDetails.id,
      entityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    })

    showToast(t("toast.answers_submitted"))

    if (props.publicAppletKey) {
      return navigator.navigate(ROUTES.publicJoin.navigateTo(props.publicAppletKey), {
        replace: true,
      })
    }

    return navigator.navigate(ROUTES.appletDetails.navigateTo(props.appletDetails.id), {
      replace: true,
    })
  }

  const redirectToNextActivity = (activityId: string) => {
    showToast(t("toast.next_activity"))

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
      return completeEntityAndRedirect()
    }

    return redirectToNextActivity(nextActivityId)
  }

  const completeActivity = () => {
    clearActivityItemsProgressById(props.activityId, props.eventId)

    return completeEntityAndRedirect()
  }

  return {
    completeActivity,
    completeFlow,
  }
}
