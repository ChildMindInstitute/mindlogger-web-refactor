import { useCallback } from "react"

import { actions } from "../activity.slice"
import { activitySelector } from "../selectors"
import {
  ActivityProgressState,
  AppletProgressState,
  EventProgressState,
  ProgressState,
  UpsertActionPayload,
} from "../types"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type GetEventProgressParams = {
  appletId: string
  activityId: string
  eventId: string
}

type UseActivityInProgressStateReturn = {
  progressState: ProgressState
  upsertActivityInProgress: (payload: UpsertActionPayload) => void
  clearActivityInProgressState: () => void
  progressStateByAppletId: (appletId: string) => AppletProgressState | null
  progressStateByActivityId: (
    activityId: string,
    appletProgressState: AppletProgressState,
  ) => ActivityProgressState | null
  eventProgressByParams: (params: GetEventProgressParams) => EventProgressState | null
}

export const useActivityInProgressState = (): UseActivityInProgressStateReturn => {
  const dispatch = useAppDispatch()

  const progressState = useAppSelector(activitySelector)

  const upsertActivityInProgress = useCallback(
    (payload: UpsertActionPayload) => {
      dispatch(actions.upsertActivityById(payload))
    },
    [dispatch],
  )

  const clearActivityInProgressState = useCallback(() => {
    dispatch(actions.clearActivity())
  }, [dispatch])

  const progressStateByAppletId = (appletId: string): AppletProgressState | null => {
    const appletProgressState = progressState[appletId]

    if (!appletProgressState) {
      return null
    }

    return appletProgressState
  }

  const progressStateByActivityId = (
    activityId: string,
    appletProgressState: AppletProgressState,
  ): ActivityProgressState | null => {
    const activityProgressState = appletProgressState[activityId]

    if (!activityProgressState) {
      return null
    }

    return activityProgressState
  }

  const eventProgressByParams = (params: GetEventProgressParams): EventProgressState | null => {
    const { appletId, activityId, eventId } = params

    const appletProgressState = progressStateByAppletId(appletId)

    if (!appletProgressState) {
      return null
    }

    const activityProgressState = progressStateByActivityId(activityId, appletProgressState)

    if (!activityProgressState) {
      return null
    }

    const eventProgressState = activityProgressState[eventId]

    if (!eventProgressState) {
      return null
    }

    return eventProgressState
  }

  return {
    progressState,
    upsertActivityInProgress,
    clearActivityInProgressState,
    progressStateByAppletId,
    progressStateByActivityId,
    eventProgressByParams,
  }
}
