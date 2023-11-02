import { invitationService, MutationOptions, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof invitationService.declineInvitation>

export const useDeclineInviteMutation = (options?: Options) => {
  return useBaseMutation(["declineInvitation"], invitationService.declineInvitation, { ...options })
}
