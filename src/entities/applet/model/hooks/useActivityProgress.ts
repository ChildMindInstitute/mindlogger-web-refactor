import { useCallback } from "react"

import { mapItemToRecord, mapSplashScreenToRecord } from "../mapper"
import { actions } from "../slice"
import { ItemRecord } from "../types"

import { ActivityDTO } from "~/shared/api"
import { useAppDispatch } from "~/shared/utils"

type SaveProgressProps = {
  activity: ActivityDTO
  eventId: string
}

export const useActivityProgress = () => {
  const dispatch = useAppDispatch()

  const setInitialProgress = useCallback(
    (props: SaveProgressProps) => {
      const initialStep = 0

      const isSplashScreenExist = !!props.activity.splashScreen
      let splashScreenItem: ItemRecord | undefined

      if (isSplashScreenExist) {
        splashScreenItem = mapSplashScreenToRecord(props.activity.splashScreen)
      }

      const preparedActivityItemProgressRecords = props.activity.items
        .filter(x => !x.isHidden)
        .map(item => {
          return mapItemToRecord(item)
        })

      const items = splashScreenItem
        ? [splashScreenItem, ...preparedActivityItemProgressRecords]
        : preparedActivityItemProgressRecords

      return dispatch(
        actions.saveActivityProgress({
          activityId: props.activity.id,
          eventId: props.eventId,
          progress: {
            items,
            step: initialStep,
            userEvents: [],
          },
        }),
      )
    },
    [dispatch],
  )

  return {
    setInitialProgress,
  }
}
