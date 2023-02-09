import { appletService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof appletService.getById
type Options<TData> = QueryOptions<FetchFn, TData>

export const useAppletByIdQuery = <TData = ReturnAwaited<FetchFn>>(appletId: string, options?: Options<TData>) => {
  return useBaseQuery(["appletById", { appletId }], () => appletService.getById({ appletId }), options)
}
