import { groupProgressSelector } from "../selectors"
import { actions } from "../slice"

import { GroupProgress, getProgressId } from "~/abstract/lib"
import { ActivityFlowDTO } from "~/shared/api"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

export const useStartEntity = () => {
  const dispatch = useAppDispatch()
  const groupProgress = useAppSelector(groupProgressSelector)

  const getProgress = (entityId: string, eventId: string): GroupProgress =>
    groupProgress[getProgressId(entityId, eventId)]

  const isInProgress = (payload: GroupProgress): boolean => payload && !payload.endAt

  function activityStarted(activityId: string, eventId: string): void {
    dispatch(
      actions.activityStarted({
        activityId,
        eventId,
      }),
    )
  }

  function flowStarted(flowId: string, activityId: string, eventId: string, pipelineActivityOrder: number): void {
    dispatch(
      actions.flowStarted({
        flowId,
        activityId,
        eventId,
        pipelineActivityOrder,
      }),
    )
  }

  function startActivity(activityId: string, eventId: string): void {
    const isActivityInProgress = isInProgress(getProgress(activityId, eventId))

    if (isActivityInProgress) {
      return
    }

    return activityStarted(activityId, eventId)
  }

  function startFlow(flowId: string, eventId: string, flows: ActivityFlowDTO[]): void {
    const isFlowInProgress = isInProgress(getProgress(flowId, eventId))

    if (isFlowInProgress) {
      return
    }

    const flow = flows.find(x => x.id === flowId)!
    const flowActivities: string[] = flow.activityIds

    const firstActivityId: string = flowActivities[0]

    return flowStarted(flowId, firstActivityId, eventId, 0)
  }

  return { startActivity, startFlow }
}
