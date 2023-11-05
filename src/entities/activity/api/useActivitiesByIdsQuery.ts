import { useQueries } from "@tanstack/react-query"

import { activityService } from "~/shared/api"

type Props = {
  activitiesIds: Array<string>
}

export const useActivitiesByIdsQuery = ({ activitiesIds }: Props) => {
  return useQueries({
    queries: activitiesIds.map(activityId => {
      return {
        queryKey: ["activity", activityId],
        queryFn: () => activityService.getById({ activityId }),
      }
    }),
  })
}
