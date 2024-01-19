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

  return {
    saveItemAnswer,
  }
}