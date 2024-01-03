import { useCallback } from "react"

import { groupsInProgressSelector } from "../selectors"
import { actions } from "../slice"
import { InProgressEntity, InProgressFlow, UpsertActionPayload } from "../types"

import { EventProgressState } from "~/abstract/lib"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

type GetGroupInProgressByParams = {
  appletId: string
  activityId: string
  eventId: string
}

type Return = {
  upsertGroupInProgress: (payload: UpsertActionPayload) => void
  getGroupInProgressByIds: (params: GetGroupInProgressByParams) => EventProgressState | null
  entityCompleted: (props: InProgressEntity) => void
  flowUpdated: (props: InProgressFlow) => void
}

export const useActivityGroupsInProgressState = (): Return => {
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
      const appletProgress = groupsInProgress[params.appletId]
      if (!appletProgress) {
        return null
      }

      const activityProgress = appletProgress[params.activityId]
      if (!activityProgress) {
        return null
      }

      const eventProgress = activityProgress[params.eventId]
      if (!eventProgress) {
        return null
      }

      return eventProgress
    },
    [groupsInProgress],
  )

  return {
    upsertGroupInProgress,
    getGroupInProgressByIds,
    entityCompleted,
    flowUpdated,
  }
}
