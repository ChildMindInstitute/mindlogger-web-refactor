import { useActivityByIdQuery } from "../../api"

type Props = {
  isPublic: boolean
  activityId: string
}

export const useActivity = (props: Props) => {
  const { data: activity, isError, isLoading } = useActivityByIdQuery(props, { select: data => data.data.result })

  return {
    activity,
    isError,
    isLoading,
  }
}
