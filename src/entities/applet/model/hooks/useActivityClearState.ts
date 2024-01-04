import { useCallback } from "react"

import { actions } from "../slice"

import { useAppDispatch } from "~/shared/utils"

type Return = {
  clearActivityItemsProgressById: (activityId: string, eventId: string) => void
}

export const useActivityClearState = (): Return => {
  const dispatch = useAppDispatch()

  const clearActivityItemsProgressById = useCallback(
    (activityId: string, eventId: string) => {
      dispatch(actions.removeActivityProgress({ activityId, eventId }))
    },
    [dispatch],
  )

  return {
    clearActivityItemsProgressById,
  }
}
