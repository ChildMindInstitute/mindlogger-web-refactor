import { useCallback } from "react"

import { ActivityListItem } from "../../lib"
import { actions, ActivityState } from "../activity.slice"
import { activitySelector } from "../selectors"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseActivityStateReturn = {
  selectedActivity: ActivityState
  saveActivity: (data: ActivityListItem) => void
  clearActivity: () => void
}

export const useActivityState = (): UseActivityStateReturn => {
  const selectedActivity = useAppSelector(activitySelector)

  const dispatch = useAppDispatch()

  const saveActivity = useCallback(
    (data: ActivityListItem) => {
      return dispatch(actions.saveSelectedActivity(data))
    },
    [dispatch],
  )

  const clearActivity = useCallback(() => {
    return dispatch(actions.clearActivity())
  }, [dispatch])

  return {
    selectedActivity,
    saveActivity,
    clearActivity,
  }
}
