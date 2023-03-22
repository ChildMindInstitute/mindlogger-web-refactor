import { useCallback } from "react"

import { getActivityEventProgressId } from "../../lib"
import { actions } from "../activity.slice"

import { useAppDispatch } from "~/shared/utils"

type UseSaveActivityItemAnswerProps = {
  activityId: string
  eventId: string
}

export const useSaveActivityItemAnswer = (props: UseSaveActivityItemAnswerProps) => {
  const dispatch = useAppDispatch()

  const saveActivityItemAnswer = useCallback(
    (itemId: string, answer: string) => {
      const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)

      const params = {
        activityEventId,
        itemId,
        answer: [answer],
      }

      dispatch(actions.saveActivityEventAnswerById(params))
    },
    [dispatch, props.activityId, props.eventId],
  )

  return {
    saveActivityItemAnswer,
  }
}
