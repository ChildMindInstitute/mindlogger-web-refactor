import { QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"
import { activityService } from "~/shared/api/"

type FetchFn = typeof activityService.getCompletedEntities
type Options<TData> = QueryOptions<FetchFn, TData>

type Params = {
  appletId: string
  version: string
  fromDate: string
}

export const useCompletedEntitiesQuery = <TData = ReturnAwaited<FetchFn>>(params: Params, options?: Options<TData>) => {
  return useBaseQuery(["completedEntities", params], () => activityService.getCompletedEntities(params), options)
}
