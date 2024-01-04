import { useCallback } from "react"

import { getActivityItemScreenId } from "../../lib"
import { mapItemAnswerToUserEventResponse } from "../mapper"
import { selectActivityProgress } from "../selectors"
import { actions } from "../slice"
import { ItemRecord, UserEventTypes } from "../types"

import { getProgressId } from "~/abstract/lib"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
}

export const useUserEvents = (props: Props) => {
  const dispatch = useAppDispatch()

  const progressId = getProgressId(props.activityId, props.eventId)

  const activityProgress = useAppSelector(state => selectActivityProgress(state, progressId))

  const saveUserEventByType = useCallback(
    (type: UserEventTypes, item: ItemRecord) => {
      const activityItemScreenId = getActivityItemScreenId(props.activityId, item.id)

      dispatch(
        actions.saveUserEvent({
          entityId: props.activityId,
          eventId: props.eventId,
          itemId: item.id,
          userEvent: {
            type,
            screen: activityItemScreenId,
            time: Date.now(),
          },
        }),
      )
    },
    [dispatch, props.activityId, props.eventId],
  )

  const saveSetAnswerUserEvent = useCallback(
    (item: ItemRecord) => {
      if (!activityProgress) {
        return
      }

      const userEvents = activityProgress.userEvents

      const activityItemScreenId = getActivityItemScreenId(props.activityId, item.id)

      if (item.responseType === "text" && userEvents.length > 0) {
        const lastUserEvent = userEvents[userEvents.length - 1]

        if (lastUserEvent.screen === activityItemScreenId && lastUserEvent.type === "SET_ANSWER") {
          return dispatch(
            actions.updateUserEventByIndex({
              entityId: props.activityId,
              eventId: props.eventId,
              userEventIndex: userEvents.length - 1,
              userEvent: {
                type: "SET_ANSWER",
                screen: activityItemScreenId,
                time: Date.now(),
                response: item.answer[0],
              },
            }),
          )
        }
      }

      return dispatch(
        actions.saveUserEvent({
          entityId: props.activityId,
          eventId: props.eventId,
          itemId: item.id,
          userEvent: {
            type: "SET_ANSWER",
            screen: activityItemScreenId,
            time: Date.now(),
            response: mapItemAnswerToUserEventResponse(item),
          },
        }),
      )
    },
    [activityProgress, dispatch, props.activityId, props.eventId],
  )

  return { saveUserEventByType, saveSetAnswerUserEvent }
}
