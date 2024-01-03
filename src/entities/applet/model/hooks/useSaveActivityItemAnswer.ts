import { useCallback } from "react"

import { actions } from "../slice"

import { getActivityEventProgressId } from "~/abstract/lib"
import { useAppDispatch } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
}

export const useSaveItemAnswer = ({ activityId, eventId }: Props) => {
  const dispatch = useAppDispatch()

  const saveItemAnswer = useCallback(
    (itemId: string, answer: string[]) => {
      const activityEventId = getActivityEventProgressId(activityId, eventId)

      dispatch(
        actions.saveActivityEventAnswerById({
          activityEventId,
          itemId,
          answer,
        }),
      )
    },
    [dispatch, activityId, eventId],
  )

  return {
    saveItemAnswer,
  }
}
