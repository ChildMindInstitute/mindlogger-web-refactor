import { useCallback } from "react"

import { groupsInProgressSelector } from "../selectors"
import { actions } from "../slice"
import { InProgressEntity, InProgressFlow, SaveGroupProgressPayload } from "../types"

import { EventProgressState } from "~/abstract/lib"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

type Return = {
  saveGroupProgress: (payload: SaveGroupProgressPayload) => void
  getGroupProgress: (params: InProgressEntity) => EventProgressState | null
  entityCompleted: (props: InProgressEntity) => void
  flowUpdated: (props: InProgressFlow) => void
}

export const useGroupProgressState = (): Return => {
  const dispatch = useAppDispatch()
  const groupsInProgress = useAppSelector(groupsInProgressSelector)

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

  const saveGroupProgress = useCallback(
    (payload: SaveGroupProgressPayload) => {
      dispatch(actions.saveGroupProgress(payload))
    },
    [dispatch],
  )

  const getGroupProgress = useCallback(
    (params: InProgressEntity) => {
      const appletProgress = groupsInProgress[params.appletId]

      if (!appletProgress) {
        return null
      }

      const activityProgress = appletProgress[params.entityId]

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
    saveGroupProgress,
    getGroupProgress,
    entityCompleted,
    flowUpdated,
  }
}
