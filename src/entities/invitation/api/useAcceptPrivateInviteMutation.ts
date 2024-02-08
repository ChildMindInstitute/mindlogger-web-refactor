import { invitationService, MutationOptions, useBaseMutation } from '~/shared/api';

type Options = MutationOptions<typeof invitationService.acceptPrivateInvitation>;

export const useAcceptPrivateInviteMutation = (options?: Options) => {
  return useBaseMutation(['privateAcceptInvitation'], invitationService.acceptPrivateInvitation, { ...options });
};
