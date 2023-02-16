import { invitationService, MutationOptions, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof invitationService.declinePrivateInvitation>

export const useDeclinePrivateInviteMutation = (options?: Options) => {
  return useBaseMutation(["declinePrivateInvitation"], invitationService.declinePrivateInvitation, { ...options })
}
