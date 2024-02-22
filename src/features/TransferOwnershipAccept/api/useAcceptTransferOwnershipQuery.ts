import { invitationService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof invitationService.acceptTransferOwnership
type Options<TData> = QueryOptions<FetchFn, TData>

type Params = {
  appletId: string
  key: string
}

export const useAcceptTransferOwnershipQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ["acceptTransferOwnership", params],
    () => invitationService.acceptTransferOwnership(params),
    options,
  )
}
