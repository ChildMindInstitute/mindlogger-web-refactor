import { useCallback } from "react"

import { ActivityDetails, getActivityEventProgressId } from "../../lib"
import { actions } from "../activity.slice"
import { activityBuilder } from "../activityBuilder"

import { useAppDispatch } from "~/shared/utils"

type UseActivityEventProgressReturn = {
  saveActivityEventRecords: (activity: ActivityDetails, eventId: string) => void
}

export const useSaveActivityEventProgress = (): UseActivityEventProgressReturn => {
  const dispatch = useAppDispatch()

  const saveActivityEventRecords = useCallback(
    (activity: ActivityDetails, eventId: string) => {
      const preparedActivityItemProgressRecords = activity.items.map(item => {
        return activityBuilder.convertActivityItemToEmptyProgressRecord(item)
      })

      const activityEventProgressId = getActivityEventProgressId(activity.id, eventId)

      return dispatch(
        actions.saveActivityEventRecords({ [activityEventProgressId]: preparedActivityItemProgressRecords }),
      )
    },
    [dispatch],
  )

  return {
    saveActivityEventRecords,
  }
}
