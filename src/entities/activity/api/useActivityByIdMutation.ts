import { MutationOptions, activityService, useBaseMutation } from "~/shared/api"

type Params = {
  isPublic: boolean
}

type Options = MutationOptions<typeof activityService.getById>

export const useActivityByIdMutation = (params: Params, options?: Options) => {
  return useBaseMutation(
    [`activityById isPublic=${params.isPublic}`],
    params.isPublic ? activityService.getPublicById : activityService.getById,
    {
      ...options,
    },
  )
}
