import { useActivityByIdQuery } from "../../api"
import { mapActivityDTOToActivity } from "../mapper"

type Props = {
  isPublic: boolean
  activityId: string
}

export const useActivity = (props: Props) => {
  const {
    data: activity,
    isError,
    isLoading,
  } = useActivityByIdQuery(props, { select: data => mapActivityDTOToActivity(data.data.result) })

  return {
    activity,
    isError,
    isLoading,
  }
}
