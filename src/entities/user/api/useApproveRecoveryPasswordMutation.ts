import { authorizationService, MutationOptions, useBaseMutation } from '~/shared/api';

type Options = MutationOptions<typeof authorizationService.approveRecoveryPassword>;

export const useApproveRecoveryPasswordMutation = (options?: Options) => {
  return useBaseMutation(
    ['approveRecoveryPassword'],
    authorizationService.approveRecoveryPassword,
    { ...options },
  );
};
