import { usePublicSaveAnswerMutation, useSaveAnswerMutation } from '~/entities/activity';
import { MixEvents, MixProperties, Mixpanel } from '~/shared/utils';

type Props = {
  isPublic: boolean;

  onSubmitSuccess: () => void;
};

export const useSubmitAnswersMutations = (props: Props) => {
  const {
    mutate: submitAnswers,
    isLoading: submitLoading,
    mutateAsync: asyncSubmitAnswers,
  } = useSaveAnswerMutation({
    onSuccess(_, variables) {
      Mixpanel.track(MixEvents.AssessmentCompleted, {
        [MixProperties.AppletId]: variables.appletId,
        [MixProperties.SubmitId]: variables.submitId,
      });

      return props.onSubmitSuccess();
    },
  });

  const {
    mutate: submitPublicAnswers,
    isLoading: publicSubmitLoading,
    mutateAsync: asyncSubmitPublicAnswers,
  } = usePublicSaveAnswerMutation({
    onSuccess(_, variables) {
      Mixpanel.track(MixEvents.AssessmentCompleted, {
        [MixProperties.AppletId]: variables.appletId,
        [MixProperties.SubmitId]: variables.submitId,
      });

      return props.onSubmitSuccess();
    },
  });

  return {
    submitAnswers: props.isPublic ? submitPublicAnswers : submitAnswers,
    submitAnswersAsync: props.isPublic ? asyncSubmitPublicAnswers : asyncSubmitAnswers,
    isLoading: submitLoading || publicSubmitLoading,
  };
};
