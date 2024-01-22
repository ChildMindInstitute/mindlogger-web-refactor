import { MutationOptions, activityService, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof activityService.getById>

export const useActivityByIdMutation = (options?: Options) => {
  return useBaseMutation(["activityById"], activityService.getById, { ...options })
}
