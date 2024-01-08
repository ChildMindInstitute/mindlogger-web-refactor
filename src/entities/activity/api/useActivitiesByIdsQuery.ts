import { useQueries } from "@tanstack/react-query"

import { activityService } from "~/shared/api"

type Props = {
  ids: Array<string>
  enabled?: boolean
}

export const useActivitiesByIdsQuery = ({ ids, enabled }: Props) => {
  return useQueries({
    queries: ids.map(activityId => {
      return {
        queryKey: ["activity", activityId],
        queryFn: () => activityService.getById({ activityId }),
        enabled: enabled,
      }
    }),
  })
}
