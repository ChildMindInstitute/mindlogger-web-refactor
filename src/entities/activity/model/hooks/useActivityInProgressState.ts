import { useCallback } from "react"

import { actions } from "../activity.slice"
import { activitySelector } from "../selectors"
import { ActivityProgressState, ProgressPayloadState } from "../types"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseActivityInProgressStateReturn = {
  activitiesInProgress: ActivityProgressState
  upsertActivityInProgress: (payload: ProgressPayloadState) => void
  clearActivityInProgressState: () => void
}

export const useActivityInProgressState = (): UseActivityInProgressStateReturn => {
  const dispatch = useAppDispatch()

  const activitiesInProgress = useAppSelector(activitySelector)

  const upsertActivityInProgress = useCallback(
    (payload: ProgressPayloadState) => {
      dispatch(actions.upsertActivityById(payload))
    },
    [dispatch],
  )

  const clearActivityInProgressState = useCallback(() => {
    dispatch(actions.clearActivity())
  }, [dispatch])

  return {
    activitiesInProgress,
    upsertActivityInProgress,
    clearActivityInProgressState,
  }
}
