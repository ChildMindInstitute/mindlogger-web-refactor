import { useCallback } from "react"

import { mapItemToRecord, mapSplashScreenToRecord } from "../mapper"
import { actions } from "../slice"
import { ActivityEventProgressRecord } from "../types"

import { ActivityDetails } from "~/entities/activity/lib"
import { useAppDispatch } from "~/shared/utils"

type UseActivityEventProgressReturn = {
  saveItemsRecord: (activity: ActivityDetails, eventId: string, step: number) => void
  clearItemsRecord: (activityId: string, eventId: string) => void
}

export const useSaveActivityEventProgress = (): UseActivityEventProgressReturn => {
  const dispatch = useAppDispatch()

  const saveItemsRecord = useCallback(
    (activity: ActivityDetails, eventId: string, step: number) => {
      const isSplashScreenExist = !!activity.splashScreen
      let splashScreenItem: ActivityEventProgressRecord | undefined

      if (isSplashScreenExist) {
        splashScreenItem = mapSplashScreenToRecord(activity.splashScreen)
      }

      const preparedActivityItemProgressRecords = activity.items
        .filter(x => !x.isHidden)
        .map(item => {
          return mapItemToRecord(item)
        })

      const items = splashScreenItem
        ? [splashScreenItem, ...preparedActivityItemProgressRecords]
        : preparedActivityItemProgressRecords

      return dispatch(
        actions.saveActivityProgress({
          activityId: activity.id,
          eventId,
          progress: {
            items,
            step,
            userEvents: [],
          },
        }),
      )
    },
    [dispatch],
  )

  const clearItemsRecord = useCallback(
    (activityId: string, eventId: string) => {
      dispatch(
        actions.saveActivityProgress({
          activityId,
          eventId,
          progress: {
            items: [],
            step: 1,
            userEvents: [],
          },
        }),
      )
    },
    [dispatch],
  )

  return {
    saveItemsRecord,
    clearItemsRecord,
  }
}
