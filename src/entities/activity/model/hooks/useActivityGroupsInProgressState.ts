import { useCallback } from "react"

import { actions } from "../activity.slice"
import { groupsInProgressSelector } from "../selectors"
import { GroupsProgressState, InProgressEntity, UpsertActionPayload } from "../types"
import { EventProgressState } from "../types"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type GetGroupInProgressByParams = {
  appletId: string
  activityId: string
  eventId: string
}

type UseActivityGroupsInProgressStateReturn = {
  groupsInProgress: GroupsProgressState
  upsertGroupInProgress: (payload: UpsertActionPayload) => void
  getGroupInProgressByIds: (params: GetGroupInProgressByParams) => EventProgressState
  entityCompleted: (props: InProgressEntity) => void
}

export const useActivityGroupsInProgressState = (): UseActivityGroupsInProgressStateReturn => {
  const dispatch = useAppDispatch()
  const groupsInProgress = useAppSelector(groupsInProgressSelector)

  const upsertGroupInProgress = useCallback(
    (payload: UpsertActionPayload) => {
      dispatch(actions.upsertGroupProgressByParams(payload))
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
        throw new Error(`Group by appletId ${params.appletId} not found`)
      }

      const groupByActivityId = groupByAppletId[params.activityId]
      if (!groupByActivityId) {
        throw new Error(`Group by activityId ${params.activityId} not found`)
      }

      const groupByEventId = groupByActivityId[params.eventId]
      if (!groupByEventId) {
        throw new Error(`Group by eventId ${params.eventId} not found`)
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
  }
}
