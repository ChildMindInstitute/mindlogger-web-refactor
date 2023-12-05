import { actions } from "../activity.slice"
import { groupsInProgressSelector } from "../selectors"

import { EventProgressState } from "~/abstract/lib"
import { AppletDetailsDTO } from "~/shared/api"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

export const useStartEntity = () => {
  const dispatch = useAppDispatch()
  const allProgresses = useAppSelector(groupsInProgressSelector)

  const getProgress = (appletId: string, entityId: string, eventId: string): EventProgressState =>
    allProgresses[appletId]?.[entityId]?.[eventId]

  const isInProgress = (payload: EventProgressState): boolean => payload && !payload.endAt

  function activityStarted(appletId: string, activityId: string, eventId: string) {
    dispatch(
      actions.activityStarted({
        appletId,
        activityId,
        eventId,
      }),
    )
  }

  function flowStarted(
    appletId: string,
    flowId: string,
    activityId: string,
    eventId: string,
    pipelineActivityOrder: number,
  ) {
    dispatch(
      actions.flowStarted({
        appletId,
        flowId,
        activityId,
        eventId,
        pipelineActivityOrder,
      }),
    )
  }

  function startActivity(appletId: string, activityId: string, eventId: string): void {
    const isActivityInProgress = isInProgress(getProgress(appletId, activityId, eventId))

    if (isActivityInProgress) {
      return
    }

    return activityStarted(appletId, activityId, eventId)
  }

  function startFlow(appletDetails: AppletDetailsDTO, flowId: string, eventId: string) {
    const isFlowInProgress = isInProgress(getProgress(appletDetails.id, flowId, eventId))

    if (isFlowInProgress) {
      return
    }

    const flow = appletDetails.activityFlows.find(x => x.id === flowId)!
    const flowActivities: string[] = flow.activityIds

    const firstActivityId: string = flowActivities[0]

    return flowStarted(appletDetails.id, flowId, firstActivityId, eventId, 0)
  }

  return { startActivity, startFlow }
}
