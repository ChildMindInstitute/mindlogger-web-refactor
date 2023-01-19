import { authorizationService, MutationOptions, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof authorizationService.signup>

export const useSignupMutation = (options?: Options) => {
  return useBaseMutation(["signup"], authorizationService.signup, { ...options })
}
