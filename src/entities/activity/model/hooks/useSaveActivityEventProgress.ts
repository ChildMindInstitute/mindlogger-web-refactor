import { useCallback } from "react"

import { ActivityDetails, getActivityEventProgressId } from "../../lib"
import { actions } from "../activity.slice"
import { activityBuilder } from "../activityBuilder"
import { ActivityEventProgressRecord } from "../types"

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
        splashScreenItem = activityBuilder.convertSplashScreenToItem(activity.splashScreen)
      }

      const preparedActivityItemProgressRecords = activity.items
        .filter(x => !x.isHidden)
        .map(item => {
          return activityBuilder.convertActivityItemToEmptyProgressRecord(item)
        })

      const activityEventProgressId = getActivityEventProgressId(activity.id, eventId)

      const items = splashScreenItem
        ? [splashScreenItem, ...preparedActivityItemProgressRecords]
        : preparedActivityItemProgressRecords

      return dispatch(
        actions.saveActivityEventRecords({
          [activityEventProgressId]: {
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
      const activityEventProgressId = getActivityEventProgressId(activityId, eventId)

      dispatch(
        actions.saveActivityEventRecords({
          [activityEventProgressId]: {
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
