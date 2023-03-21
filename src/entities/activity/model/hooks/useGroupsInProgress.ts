import { useCallback } from "react"

import { actions } from "../activity.slice"
import { groupsInProgressSelector } from "../selectors"
import { ProgressState, UpsertActionPayload } from "../types"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseGroupsInProgressReturn = {
  groupsInProgress: ProgressState
  upsertGroupInProgress: (payload: UpsertActionPayload) => void
}

export const useGroupsInProgress = (): UseGroupsInProgressReturn => {
  const dispatch = useAppDispatch()
  const groupsInProgress = useAppSelector(groupsInProgressSelector)

  const upsertGroupInProgress = useCallback(
    (payload: UpsertActionPayload) => {
      dispatch(actions.upsertActivityById(payload))
    },
    [dispatch],
  )

  return {
    groupsInProgress,
    upsertGroupInProgress,
  }
}
