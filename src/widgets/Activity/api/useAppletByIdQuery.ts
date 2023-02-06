import { appletService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof appletService.getById
type Options<TData> = QueryOptions<FetchFn, TData>

export const useAppletByIdQuery = <TData = ReturnAwaited<FetchFn>>(id: string | number, options?: Options<TData>) => {
  return useBaseQuery(["appletById", id], () => appletService.getById(id), options)
}
