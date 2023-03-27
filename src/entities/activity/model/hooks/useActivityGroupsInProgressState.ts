import { useCallback } from "react"

import { actions } from "../activity.slice"
import { groupsInProgressSelector } from "../selectors"
import { GroupsProgressState, UpsertActionPayload } from "../types"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseActivityGroupsInProgressStateReturn = {
  groupsInProgress: GroupsProgressState
  upsertGroupInProgress: (payload: UpsertActionPayload) => void
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

  return {
    groupsInProgress,
    upsertGroupInProgress,
  }
}
