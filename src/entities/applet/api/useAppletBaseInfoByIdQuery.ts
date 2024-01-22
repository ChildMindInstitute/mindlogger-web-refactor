import { appletService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof appletService.getBaseDetailsById
type Options<TData> = QueryOptions<FetchFn, TData>

type PublicParams = {
  isPublic: true
  publicAppletKey: string
}

type PrivateParams = {
  isPublic: false
  appletId: string
}

type Params = PublicParams | PrivateParams

export const useAppletBaseInfoByIdQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ["appletBaseDetailsById", { ...params }],
    () =>
      params.isPublic
        ? appletService.getPublicBaseDetailsByKey(params.publicAppletKey)
        : appletService.getBaseDetailsById(params.appletId),
    options,
  )
}
