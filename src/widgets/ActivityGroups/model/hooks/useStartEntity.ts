import { OnActivityCardClickProps } from "../../lib"

import { ActivityStatus, EntityType } from "~/abstract/lib/GroupBuilder"
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

    const { flowId, eventId, activity, status, shouldRestart } = params

    const activityId = activity.id
    const isActivityInProgress = status === ActivityStatus.InProgress

    if (flowId) {
      const flow = flows.find(x => x.id === flowId)!
      const firstActivityId: string = flow.activityIds[0]
      const activityIdToNavigate = shouldRestart ? firstActivityId : activityId

      startFlow(flowId, eventId, flows, shouldRestart)

      return navigateToEntity({
        activityId: activityIdToNavigate,
        entityType: "flow",
        eventId,
        flowId,
      })
    }

    if ((!isActivityInProgress || shouldRestart) && params.activity) {
      setInitialProgress({ activity, eventId: params.eventId })
    }

    startActivity(activityId, eventId)

    return navigateToEntity({
      activityId,
      entityType: "regular",
      eventId,
      flowId: null,
    })
  }

  return {
    startActivityOrFlow,
  }
}
