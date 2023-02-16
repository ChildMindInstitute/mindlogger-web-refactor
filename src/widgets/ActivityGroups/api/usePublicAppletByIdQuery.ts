import { appletService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof appletService.getPublicById
type Options<TData> = QueryOptions<FetchFn, TData>

export const usePublicAppletByIdQuery = <TData = ReturnAwaited<FetchFn>>(
  publicAppletKey: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ["publicAppletById", { publicAppletKey }],
    () => appletService.getPublicById({ publicAppletKey }),
    options,
  )
}
