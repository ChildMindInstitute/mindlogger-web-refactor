import { AxiosResponse } from 'axios';

import { usePublicSaveAnswerMutation, useSaveAnswerMutation } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { AnswerPayload } from '~/shared/api';
import {
  MixpanelEventType,
  MixpanelProps,
  Mixpanel,
  AssessmentCompletedEvent,
} from '~/shared/utils';

type Props = {
  isPublic: boolean;
  onSubmitSuccess?: (variables: AnswerPayload) => void;
};

export const useSubmitAnswersMutations = ({ isPublic, onSubmitSuccess }: Props) => {
  const { isInMultiInformantFlow, getMultiInformantState, updateMultiInformantState } =
    appletModel.hooks.useMultiInformantState();

  const onSuccess = (_: AxiosResponse, variables: AnswerPayload) => {
    const event: AssessmentCompletedEvent = {
      action: MixpanelEventType.AssessmentCompleted,
      [MixpanelProps.AppletId]: variables.appletId,
      [MixpanelProps.SubmitId]: variables.submitId,
      [MixpanelProps.ActivityId]: variables.activityId,
    };

    if (variables.flowId) {
      event[MixpanelProps.ActivityFlowId] = variables.flowId;
    }

    if (isInMultiInformantFlow()) {
      event[MixpanelProps.Feature] = 'Multi-informant';

      const { multiInformantAssessmentId, submitId } = getMultiInformantState();
      if (multiInformantAssessmentId) {
        event[MixpanelProps.MultiInformantAssessmentId] = multiInformantAssessmentId;
      }

      if (submitId === null) {
        updateMultiInformantState({
          submitId: variables.submitId,
        });
      }
    }

    Mixpanel.track(event);

    return onSubmitSuccess && onSubmitSuccess(variables);
  };

  const {
    mutate: submit,
    isLoading: submitLoading,
    mutateAsync: submitAsync,
  } = useSaveAnswerMutation({
    onSuccess,
  });

  const {
    mutate: publicSubmit,
    isLoading: publicSubmitLoading,
    mutateAsync: publicSubmitAsync,
  } = usePublicSaveAnswerMutation({
    onSuccess,
  });

  return {
    submitAnswers: isPublic ? publicSubmit : submit,
    submitAnswersAsync: isPublic ? publicSubmitAsync : submitAsync,
    isLoading: submitLoading || publicSubmitLoading,
  };
};
