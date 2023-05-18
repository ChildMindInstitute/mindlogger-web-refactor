import { MutationOptions, activityService, useBaseMutation } from "~/shared/api"

type Options = MutationOptions<typeof activityService.publicSaveAnswers>

export const usePublicSaveAnswerMutation = (options?: Options) => {
  return useBaseMutation(["publicSaveAnswer"], activityService.publicSaveAnswers, { ...options })
}
