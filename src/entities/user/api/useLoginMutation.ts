import { authorizationService, MutationOptions, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof authorizationService.login>

export const useLoginMutation = (options?: Options) => {
  return useBaseMutation(["login"], authorizationService.login, { ...options })
}
