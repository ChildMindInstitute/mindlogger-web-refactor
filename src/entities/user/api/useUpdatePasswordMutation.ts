import { authorizationService, MutationOptions, useBaseMutation } from '~/shared/api';

type Options = MutationOptions<typeof authorizationService.updatePassword>;

export const useUpdatePasswordMutation = (options?: Options) => {
  return useBaseMutation(['updatePassword'], authorizationService.updatePassword, { ...options });
};
