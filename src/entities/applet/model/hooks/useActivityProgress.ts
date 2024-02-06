import { useCallback } from "react"

import { mapItemToRecord, mapSplashScreenToRecord } from "../mapper"
import { actions } from "../slice"
import { ItemRecord } from "../types"

import { ActivityDTO } from "~/shared/api"
import { useAppDispatch } from "~/shared/utils"

type SaveProgressProps = {
  activity: ActivityDTO
  eventId: string
  appletId: string
  isPublic: boolean
  publicAppletKey?: string
}

type UpdateStepProps = {
  activityId: string
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
            appletId: props.appletId,
            isPublic: props.isPublic,
            publicAppletKey: props.publicAppletKey,
          },
        }),
      )
    },
    [dispatch],
  )

  const incrementStep = useCallback(
    (props: UpdateStepProps) => {
      dispatch(actions.incrementStep(props))
    },
    [dispatch],
  )

  const decrementStep = useCallback(
    (props: UpdateStepProps) => {
      dispatch(actions.decrementStep(props))
    },
    [dispatch],
  )

  return {
    setInitialProgress,
    incrementStep,
    decrementStep,
  }
}
