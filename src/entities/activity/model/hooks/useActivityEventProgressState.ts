import { useMemo } from "react"

import { useSelector } from "react-redux"

import { getActivityEventProgressId } from "../../lib"
import { activityEventProgressSelector } from "../selectors"

type UseActivityEventProgressStateProps = {
  activityId: string
  eventId: string
}

export const useActivityEventProgressState = (props: UseActivityEventProgressStateProps) => {
  const activityEventProgressState = useSelector(activityEventProgressSelector)

  const currentActivityEventProgress = useMemo(() => {
    const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)

    return activityEventProgressState[activityEventId]
  }, [activityEventProgressState, props.activityId, props.eventId])

  return { currentActivityEventProgress }
}
