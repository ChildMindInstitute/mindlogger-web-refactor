import { useCallback } from "react"

import { useDispatch } from "react-redux"

import { useAppSelector } from "../../../../shared/utils"
import { ActivityDetails } from "../../lib"
import { actions, ActivityDetailsState } from "../activity.slice"
import { activityDetailsSelector } from "../selectors"

type UseActivityDetailsStateReturn = {
  activityDetails: ActivityDetailsState | null
  setActivityDetails: (data: ActivityDetails) => void
}

export const useActivityDetailsState = (): UseActivityDetailsStateReturn => {
  const dispatch = useDispatch()

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
