import { useCallback } from "react"

import { actions } from "../progress.slice"

import { useAppDispatch } from "~/shared/utils"

type UseClearProgressReturn = {
  clearActivityInProgressState: () => void
}

export const useClearProgress = (): UseClearProgressReturn => {
  const dispatch = useAppDispatch()

  const clearActivityInProgressState = useCallback(() => {
    dispatch(actions.clearAllProgress())
  }, [dispatch])

  return {
    clearActivityInProgressState,
  }
}
