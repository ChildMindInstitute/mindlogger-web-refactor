import { ActivityStatus, EntityType, OnActivityCardClickProps } from "../../lib"

import { appletModel } from "~/entities/applet"
import { AppletDetailsBaseInfoDTO } from "~/shared/api"
import { ROUTES } from "~/shared/constants"
import { Mixpanel, useCustomNavigation } from "~/shared/utils"

type NavigateToEntityProps = {
  flowId: string | null
  activityId: string
  entityType: EntityType
  eventId: string
}

type Props = {
  applet: AppletDetailsBaseInfoDTO
  isPublic: boolean
  publicAppletKey: string | null
}

export const useStartEntity = (props: Props) => {
  const navigator = useCustomNavigation()

  const appletId = props.applet.id
  const flows = props.applet.activityFlows

  const { setInitialProgress } = appletModel.hooks.useActivityProgress()

  const { startActivity, startFlow } = appletModel.hooks.useStartEntity()

  function navigateToEntity(params: NavigateToEntityProps) {
    const { activityId, flowId, eventId, entityType } = params

    if (props.isPublic && props.publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicActivityDetails.navigateTo({
          appletId,
          activityId,
          eventId,
          entityType,
          publicAppletKey: props.publicAppletKey,
          flowId,
        }),
      )
    }

    return navigator.navigate(
      ROUTES.activityDetails.navigateTo({
        appletId,
        activityId,
        eventId,
        entityType,
        flowId,
      }),
    )
  }

  function startActivityOrFlow(params: OnActivityCardClickProps) {
    Mixpanel.track("Assessment Started")

    const { flowId, eventId, activity, status } = params
    const activityId = activity.id

    const isFlow = Boolean(flowId)
    const isActivityInProgress = status === ActivityStatus.InProgress

    if (!isActivityInProgress && !isFlow && params.activity) {
      setInitialProgress({ activity, eventId: params.eventId })
    }

    if (flowId) {
      startFlow(flowId, eventId, flows)

      return navigateToEntity({
        activityId,
        entityType: "flow",
        eventId,
        flowId,
      })
    } else {
      startActivity(activityId, eventId)

      return navigateToEntity({
        activityId,
        entityType: "regular",
        eventId,
        flowId: null,
      })
    }
  }

  return {
    startActivityOrFlow,
  }
}
