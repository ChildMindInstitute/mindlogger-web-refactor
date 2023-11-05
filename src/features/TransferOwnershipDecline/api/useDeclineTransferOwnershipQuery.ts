import { invitationService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof invitationService.declineTransferOwnerShip
type Options<TData> = QueryOptions<FetchFn, TData>

type Params = {
  appletId: string
  key: string
}

export const useDeclineTransferOwnershipQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ["declineTransferOwnership", params],
    () => invitationService.declineTransferOwnerShip(params),
    options,
  )
}
