import { useCallback } from "react"

import { actions } from "../slice"

import { useAppDispatch } from "~/shared/utils"

type RemoveProps = {
  activityId: string
  eventId: string
}

export const useRemoveActivityProgress = () => {
  const dispatch = useAppDispatch()

  const removeActivityProgress = useCallback(
    (props: RemoveProps) => {
      dispatch(actions.removeActivityProgress(props))
    },
    [dispatch],
  )

  return {
    removeActivityProgress,
  }
}
