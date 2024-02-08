import { authorizationService, MutationOptions, useBaseMutation } from '~/shared/api';

type Options = MutationOptions<typeof authorizationService.logout>;

export const useLogoutMutation = (options?: Options) => {
  return useBaseMutation(['logout'], authorizationService.logout, { ...options });
};
