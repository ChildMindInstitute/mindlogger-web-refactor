import { QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"
import { activityService } from "~/shared/api/"

type FetchFn = typeof activityService.getById
type Options<TData> = QueryOptions<FetchFn, TData>

type Params = {
  activityId: string
}

export const useActivityByIdQuery = <TData = ReturnAwaited<FetchFn>>(params: Params, options?: Options<TData>) => {
  return useBaseQuery(["activityById", params], () => activityService.getById(params), options)
}
