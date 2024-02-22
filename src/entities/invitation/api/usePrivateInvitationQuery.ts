import { invitationService, QueryOptions, ReturnAwaited, useBaseQuery } from "~/shared/api"

type FetchFn = typeof invitationService.getPrivateInvitationById
type Options<TData> = QueryOptions<FetchFn, TData>

export const usePrivateInvitationQuery = <TData = ReturnAwaited<FetchFn>>(
  invitationId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ["privateInvitationDetails", { invitationId }],
    () => invitationService.getPrivateInvitationById({ invitationId }),
    options,
  )
}
