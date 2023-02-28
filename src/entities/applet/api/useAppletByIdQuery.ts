import { appletService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof appletService.getById
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

export const useAppletByIdQuery = <TData = ReturnAwaited<FetchFn>>(params: Params, options?: Options<TData>) => {
  return useBaseQuery(
    ["appletById", { ...params }],
    () =>
      params.isPublic
        ? appletService.getPublicById({ publicAppletKey: params.publicAppletKey })
        : appletService.getById({ appletId: params.appletId }),
    options,
  )
}
