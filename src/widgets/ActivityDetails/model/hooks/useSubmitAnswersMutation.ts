import { usePublicSaveAnswerMutation, useSaveAnswerMutation } from '~/entities/activity';
import { Mixpanel } from '~/shared/utils';

type Props = {
  isPublic: boolean;

  onSubmitSuccess: () => void;
};

export const useSubmitAnswersMutations = (props: Props) => {
  const { mutate: submitAnswers, isLoading: submitLoading } = useSaveAnswerMutation({
    onSuccess() {
      Mixpanel.track('Assessment completed');

      return props.onSubmitSuccess();
    },
  });

  const { mutate: submitPublicAnswers, isLoading: publicSubmitLoading } =
    usePublicSaveAnswerMutation({
      onSuccess() {
        Mixpanel.track('Assessment completed');

        return props.onSubmitSuccess();
      },
    });

  return {
    submitAnswers: props.isPublic ? submitPublicAnswers : submitAnswers,
    isLoading: submitLoading || publicSubmitLoading,
  };
};
