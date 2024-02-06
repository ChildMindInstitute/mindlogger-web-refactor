import { MutationOptions, useBaseMutation, appletService } from "~/shared/api"

type FetchFn = typeof appletService.getPublicByKey

type Options = MutationOptions<FetchFn>

export const useAppletByPublicKeyMutation = (options?: Options) => {
  return useBaseMutation([`appletByPublicKey`], appletService.getPublicByKey, {
    ...options,
  })
}
