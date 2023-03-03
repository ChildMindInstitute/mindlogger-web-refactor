import { useCallback } from "react"

import { ActivityDetails } from "../../lib"
import { actions, ActivityDetailsState } from "../activity.slice"
import { activityDetailsSelector } from "../selectors"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseActivityDetailsStateReturn = {
  activityDetails: ActivityDetailsState | null
  setActivityDetails: (data: ActivityDetails) => void
}

export const useActivityDetailsState = (): UseActivityDetailsStateReturn => {
  const dispatch = useAppDispatch()

  const activityDetails = useAppSelector(activityDetailsSelector)

  const setActivityDetails = useCallback(
    (data: ActivityDetails) => {
      dispatch(actions.saveActivityDetails(data))
    },
    [dispatch],
  )

  return {
    activityDetails,
    setActivityDetails,
  }
}
