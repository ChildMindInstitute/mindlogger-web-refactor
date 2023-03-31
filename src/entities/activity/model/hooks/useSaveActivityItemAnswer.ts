import { useCallback } from "react"

import { getActivityEventProgressId } from "../../lib"
import { actions } from "../activity.slice"
import { useActivityEventProgressState } from "./useActivityEventProgressState"

import { useAppDispatch } from "~/shared/utils"

type UseSaveActivityItemAnswerProps = {
  activityId: string
  eventId: string
}

export const useSaveActivityItemAnswer = (props: UseSaveActivityItemAnswerProps) => {
  const dispatch = useAppDispatch()

  const { currentActivityEventProgress } = useActivityEventProgressState(props)

  const buildActivityItemAnswer = useCallback(
    (itemId: string, answer: string) => {
      const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)
      const currentItemById = currentActivityEventProgress?.find(x => x.id === itemId)

      if (currentItemById && currentItemById.responseType === "multiSelect") {
        return {
          activityEventId,
          itemId,
          answer: [...currentItemById.answer, answer],
        }
      }

      return {
        activityEventId,
        itemId,
        answer: [answer],
      }
    },
    [currentActivityEventProgress, props.activityId, props.eventId],
  )

  const saveActivityItemAnswer = useCallback(
    (itemId: string, answer: string) => {
      const params = buildActivityItemAnswer(itemId, answer)

      dispatch(actions.saveActivityEventAnswerById(params))
    },
    [buildActivityItemAnswer, dispatch],
  )

  return {
    saveActivityItemAnswer,
  }
}
