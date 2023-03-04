import { useCallback } from "react"

import { actions, ActivityProgressState, ProgressPayloadState } from "../activity.slice"
import { activitySelector } from "../selectors"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseActivityInProgressStateReturn = {
  activitiesInProgress: ActivityProgressState
  pushActivityInProgress: (payload: ProgressPayloadState) => void
}

export const useActivityInProgressState = (): UseActivityInProgressStateReturn => {
  const dispatch = useAppDispatch()

  const activitiesInProgress = useAppSelector(activitySelector)

  const pushActivityInProgress = useCallback(
    (payload: ProgressPayloadState) => {
      dispatch(actions.saveActivityInProgress(payload))
    },
    [dispatch],
  )

  return {
    activitiesInProgress,
    pushActivityInProgress,
  }
}
