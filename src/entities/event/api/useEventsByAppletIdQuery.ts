import { eventsService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof eventsService.getEventsByAppletId
type Options<TData> = QueryOptions<FetchFn, TData>

type Params = {
  appletId: string
}

export const useEventsbyAppletIdQuery = <TData = ReturnAwaited<FetchFn>>(params: Params, options?: Options<TData>) => {
  return useBaseQuery(["eventsByAppletId", { ...params }], () => eventsService.getEventsByAppletId(params), options)
}
