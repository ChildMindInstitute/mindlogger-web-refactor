import { MutationOptions, activityService, useBaseMutation } from '~/shared/api';

type Options = MutationOptions<typeof activityService.saveAnswers>;

export const useSaveAnswerMutation = (options?: Options) => {
  return useBaseMutation(['saveAnswer'], activityService.saveAnswers, { ...options });
};
