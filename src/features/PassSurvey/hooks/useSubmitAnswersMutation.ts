import { useContext } from 'react';

import { AxiosResponse } from 'axios';

import { SurveyContext } from '..';

import { usePublicSaveAnswerMutation, useSaveAnswerMutation } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { AnswerPayload } from '~/shared/api';
import {
  MixpanelEventType,
  MixpanelProps,
  Mixpanel,
  AssessmentCompletedEvent,
  addSurveyPropsToEvent,
  MixpanelFeature,
  addFeatureToEvent,
} from '~/shared/utils';

type Props = {
  isPublic: boolean;
  onSubmitSuccess?: (variables: AnswerPayload) => void;
};

export const useSubmitAnswersMutations = ({ isPublic, onSubmitSuccess }: Props) => {
  const { isInMultiInformantFlow, getMultiInformantState, updateMultiInformantState } =
    appletModel.hooks.useMultiInformantState();

  const { applet } = useContext(SurveyContext);

  const onSuccess = (_: AxiosResponse, variables: AnswerPayload) => {
    const event: AssessmentCompletedEvent = addSurveyPropsToEvent(
      {
        action: MixpanelEventType.AssessmentCompleted,
        [MixpanelProps.SubmitId]: variables.submitId,
      },
      { applet, ...variables },
    );

    if (isInMultiInformantFlow()) {
      addFeatureToEvent(event, MixpanelFeature.MultiInformant);

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

    return onSubmitSuccess?.(variables);
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
