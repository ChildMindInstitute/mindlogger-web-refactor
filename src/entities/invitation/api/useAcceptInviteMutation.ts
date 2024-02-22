import { invitationService, MutationOptions, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof invitationService.acceptInvitation>

export const useAcceptInviteMutation = (options?: Options) => {
  return useBaseMutation(["acceptInvitation"], invitationService.acceptInvitation, { ...options })
}
