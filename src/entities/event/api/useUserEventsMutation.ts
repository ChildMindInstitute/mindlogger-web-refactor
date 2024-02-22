import { MutationOptions, eventsService, useBaseMutation } from '~/shared/api';

type Options = MutationOptions<typeof eventsService.getUserEvents>;

export const useUserEventsMutation = (options?: Options) => {
  return useBaseMutation(['getUserEvents'], eventsService.getUserEvents, { ...options });
};
