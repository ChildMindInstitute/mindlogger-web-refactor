import { useCallback } from "react"

import { getActivityEventProgressId } from "../../lib"
import { actions } from "../activity.slice"
import { activityBuilder } from "../activityBuilder"
import { ActivityEventProgressRecord } from "../types"

import { ActivityDTO } from "~/shared/api"
import { useAppDispatch } from "~/shared/utils"

type UseActivityEventProgressReturn = {
  saveActivityEventRecords: (activity: ActivityDTO, eventId: string, step: number) => void
  resetActivityEventRecordsByParams: (activityId: string, eventId: string) => void
}

export const useSaveActivityEventProgress = (): UseActivityEventProgressReturn => {
  const dispatch = useAppDispatch()

  const saveActivityEventRecords = useCallback(
    (activity: ActivityDTO, eventId: string, step: number) => {
      const isSplashScreenExist = !!activity.splashScreen
      let splashScreenItem: ActivityEventProgressRecord | undefined

      if (isSplashScreenExist) {
        splashScreenItem = activityBuilder.convertSplashScreenToItem(activity.splashScreen)
      }

      const preparedActivityItemProgressRecords = activity.items.map(item => {
        return activityBuilder.convertActivityItemToEmptyProgressRecord(item)
      })

      const activityEventProgressId = getActivityEventProgressId(activity.id, eventId)

      const activityEvents = splashScreenItem
        ? [splashScreenItem, ...preparedActivityItemProgressRecords]
        : preparedActivityItemProgressRecords

      return dispatch(
        actions.saveActivityEventRecords({
          [activityEventProgressId]: {
            activityEvents,
            step,
            userEvents: [],
          },
        }),
      )
    },
    [dispatch],
  )

  const resetActivityEventRecordsByParams = useCallback(
    (activityId: string, eventId: string) => {
      const activityEventProgressId = getActivityEventProgressId(activityId, eventId)

      dispatch(
        actions.saveActivityEventRecords({
          [activityEventProgressId]: {
            activityEvents: [],
            step: 1,
            userEvents: [],
          },
        }),
      )
    },
    [dispatch],
  )

  return {
    saveActivityEventRecords,
    resetActivityEventRecordsByParams,
  }
}
