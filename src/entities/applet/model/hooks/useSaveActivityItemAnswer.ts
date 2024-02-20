import { useCallback } from "react"

import { actions } from "../slice"

import { useAppDispatch } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
}

export const useSaveItemAnswer = ({ activityId, eventId }: Props) => {
  const dispatch = useAppDispatch()

  const saveItemAnswer = useCallback(
    (itemId: string, answer: string[]) => {
      dispatch(
        actions.saveItemAnswer({
          entityId: activityId,
          eventId,
          itemId,
          answer,
        }),
      )
    },
    [dispatch, activityId, eventId],
  )

  const saveItemAdditionalText = useCallback(
    (itemId: string, additionalText: string) => {
      dispatch(
        actions.saveAdditionalText({
          entityId: activityId,
          eventId,
          itemId,
          additionalText,
        }),
      )
    },
    [dispatch, activityId, eventId],
  )

  const removeItemAnswer = useCallback(
    (itemId: string) => {
      saveItemAnswer(itemId, [])
    },
    [saveItemAnswer],
  )

  return {
    saveItemAnswer,
    saveItemAdditionalText,
    removeItemAnswer,
  }
}
