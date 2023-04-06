import { useCallback } from "react"

import { actions } from "../activity.slice"
import { groupsInProgressSelector } from "../selectors"
import { GroupsProgressState, UpdateActionPayload, UpsertActionPayload } from "../types"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseActivityGroupsInProgressStateReturn = {
  groupsInProgress: GroupsProgressState
  upsertGroupInProgress: (payload: UpsertActionPayload) => void
  updateGroupInProgressByIds: (payload: UpdateActionPayload) => void
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

  const updateGroupInProgressByIds = useCallback(
    (payload: UpdateActionPayload) => {
      dispatch(actions.updateGroupProgressByParams(payload))
    },
    [dispatch],
  )

  return {
    groupsInProgress,
    upsertGroupInProgress,
    updateGroupInProgressByIds,
  }
}
