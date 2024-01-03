import { useCallback } from "react"

import { actions } from "../slice"

import { getActivityEventProgressId } from "~/entities/activity/lib"
import { useAppDispatch } from "~/shared/utils"

type UseSaveActivityItemAnswerProps = {
  activityId: string
  eventId: string
}

export const useSaveActivityItemAnswer = (props: UseSaveActivityItemAnswerProps) => {
  const dispatch = useAppDispatch()

  const saveActivityItemAnswer = useCallback(
    (itemId: string, answer: string[]) => {
      const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)

      dispatch(
        actions.saveActivityEventAnswerById({
          activityEventId,
          itemId,
          answer,
        }),
      )
    },
    [dispatch, props.activityId, props.eventId],
  )

  return {
    saveActivityItemAnswer,
  }
}
