import { useCallback } from "react"

import { activityEventProgressSelector } from "../selectors"
import { actions } from "../slice"
import { ActivityEventProgressRecord, UserEventTypes } from "../types"

import { getActivityEventProgressId, getActivityItemScreenId } from "~/entities/activity/lib"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseUserEventProps = {
  activityId: string
  eventId: string
}

export const useUserEvent = (props: UseUserEventProps) => {
  const dispatch = useAppDispatch()
  const activityEventProgress = useAppSelector(activityEventProgressSelector)

  const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)
  const activityEventProgressRecord = activityEventProgress[activityEventId]

  const saveUserEventByType = useCallback(
    (type: UserEventTypes, item: ActivityEventProgressRecord) => {
      if (!activityEventProgressRecord) {
        return
      }

      const activityItemScreenId = getActivityItemScreenId(props.activityId, item.id)

      dispatch(
        actions.insertUserEventById({
          activityEventId,
          itemId: item.id,
          userEvent: {
            type,
            screen: activityItemScreenId,
            time: Date.now(),
          },
        }),
      )
    },
    [activityEventId, activityEventProgressRecord, dispatch, props.activityId],
  )

  return { saveUserEventByType }
}