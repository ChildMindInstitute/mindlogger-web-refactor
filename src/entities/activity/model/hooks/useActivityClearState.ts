import { useCallback } from "react"

import { actions } from "../activity.slice"

import { useAppDispatch } from "~/shared/utils"

type UseActivityClearStateReturn = {
  clearActivityInProgressState: () => void
}

export const useActivityClearState = (): UseActivityClearStateReturn => {
  const dispatch = useAppDispatch()

  const clearActivityInProgressState = useCallback(() => {
    dispatch(actions.clearActivity())
  }, [dispatch])

  return {
    clearActivityInProgressState,
  }
}
