import { useCallback } from "react"

import { groupsInProgressSelector } from "../selectors"
import { actions } from "../slice"
import { InProgressEntity, InProgressFlow, UpsertActionPayload } from "../types"

import { EventProgressState, Progress } from "~/abstract/lib"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

type GetGroupInProgressByParams = {
  appletId: string
  activityId: string
  eventId: string
}

type UseActivityGroupsInProgressStateReturn = {
  groupsInProgress: Progress
  upsertGroupInProgress: (payload: UpsertActionPayload) => void
  getGroupInProgressByIds: (params: GetGroupInProgressByParams) => EventProgressState | null
  entityCompleted: (props: InProgressEntity) => void
  flowUpdated: (props: InProgressFlow) => void
}

export const useActivityGroupsInProgressState = (): UseActivityGroupsInProgressStateReturn => {
  const dispatch = useAppDispatch()
  const groupsInProgress = useAppSelector(groupsInProgressSelector)

  const upsertGroupInProgress = useCallback(
    (payload: UpsertActionPayload) => {
      dispatch(actions.insertGroupProgressByParams(payload))
    },
    [dispatch],
  )

  const flowUpdated = useCallback(
    (props: InProgressFlow) => {
      dispatch(actions.flowUpdated(props))
    },
    [dispatch],
  )

  const entityCompleted = useCallback(
    (props: InProgressEntity) => {
      dispatch(actions.entityCompleted(props))
    },
    [dispatch],
  )

  const getGroupInProgressByIds = useCallback(
    (params: GetGroupInProgressByParams) => {
      const groupByAppletId = groupsInProgress[params.appletId]
      if (!groupByAppletId) {
        return null
      }

      const groupByActivityId = groupByAppletId[params.activityId]
      if (!groupByActivityId) {
        return null
      }

      const groupByEventId = groupByActivityId[params.eventId]
      if (!groupByEventId) {
        return null
      }

      return groupByEventId
    },
    [groupsInProgress],
  )

  return {
    groupsInProgress,
    upsertGroupInProgress,
    getGroupInProgressByIds,
    entityCompleted,
    flowUpdated,
  }
}
