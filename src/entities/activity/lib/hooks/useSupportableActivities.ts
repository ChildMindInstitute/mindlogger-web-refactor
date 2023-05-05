import { useMemo } from "react"

import { useActivityByIdQuery } from "../../api"
import { activityBuilder } from "../../model"

type Props = {
  activityId: string
}

export const useSupportableActivity = ({ activityId }: Props) => {
  const { data, isError, isLoading } = useActivityByIdQuery({ activityId })

  const activity = useMemo(() => {
    return data?.data?.result
  }, [data])

  const isSupportedActivity = useMemo(() => {
    return activityBuilder.isSupportedActivity(activity)
  }, [activity])

  return {
    isSupportedActivity,
    isError,
    isLoading,
  }
}
