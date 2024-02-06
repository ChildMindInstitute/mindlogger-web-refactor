import { MutationOptions, useBaseMutation, appletService } from "~/shared/api"

type FetchFn = typeof appletService.getById

type Options = MutationOptions<FetchFn>

export const useAppletByIdMutation = (options?: Options) => {
  return useBaseMutation([`appletById`], appletService.getById, {
    ...options,
  })
}
