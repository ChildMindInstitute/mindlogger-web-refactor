import { MutationOptions, activityService, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof activityService.getPublicById>

export const usePublicActivityByIdMutation = (options?: Options) => {
  return useBaseMutation(["publicActivityById"], activityService.getPublicById, { ...options })
}
