import { useMemo } from "react"

import { useActivityByIdQuery } from "../../api"
import { activityBuilder } from "../../model"

type Props = {
  isPublic: boolean
  activityId: string
}

export const useSupportableActivity = (props: Props) => {
  const { data, isError, isLoading } = useActivityByIdQuery(props)

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
