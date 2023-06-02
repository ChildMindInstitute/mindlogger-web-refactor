import { useCallback } from "react"

import { getActivityEventProgressId, getActivityItemScreenId } from "../../lib"
import { actions } from "../activity.slice"
import { mapItemAnswerToUserEventResponse } from "../itemAnswerToUserEventResponse.mapper"
import { activityEventProgressSelector } from "../selectors"
import { ActivityEventProgressRecord } from "../types"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseSaveActivityItemAnswerProps = {
  activityId: string
  eventId: string
}

export const useSetAnswerUserEvent = (props: UseSaveActivityItemAnswerProps) => {
  const dispatch = useAppDispatch()
  const activityEventProgress = useAppSelector(activityEventProgressSelector)

  const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)
  const activityEventProgressRecord = activityEventProgress[activityEventId]

  const saveSetAnswerUserEvent = useCallback(
    (item: ActivityEventProgressRecord) => {
      if (!activityEventProgressRecord) {
        return
      }
      const userEvents = activityEventProgressRecord.userEvents

      const activityItemScreenId = getActivityItemScreenId(props.activityId, item.id)

      if (item.responseType === "text" && userEvents.length > 0) {
        const lastUserEvent = userEvents[userEvents.length - 1]

        if (lastUserEvent.screen === activityItemScreenId && lastUserEvent.type === "SET_ANSWER") {
          return dispatch(
            actions.updateUserEventByIndex({
              activityEventId,
              itemId: item.id,
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
        actions.insertUserEventById({
          activityEventId,
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
    [activityEventId, activityEventProgressRecord, dispatch, props.activityId],
  )

  return { saveSetAnswerUserEvent }
}
