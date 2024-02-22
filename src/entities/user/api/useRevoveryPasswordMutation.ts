import { authorizationService, MutationOptions, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof authorizationService.recoveryPassword>

export const useRecoveryPasswordMutation = (options?: Options) => {
  return useBaseMutation(["recoveryPassword"], authorizationService.recoveryPassword, { ...options })
}
