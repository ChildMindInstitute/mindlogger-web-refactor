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
    (step: number, answer: string[]) => {
      dispatch(
        actions.saveItemAnswer({
          entityId: activityId,
          eventId,
          step,
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
