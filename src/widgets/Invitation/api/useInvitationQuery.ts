import { invitationService, QueryOptions, useBaseQuery } from "~/shared/api"

type Options = QueryOptions<typeof invitationService.getInvitationById>

export const useInvitationQuery = (id: string, options?: Options) => {
  return useBaseQuery(["invitationDetails", id], () => invitationService.getInvitationById(id), { ...options })
}
