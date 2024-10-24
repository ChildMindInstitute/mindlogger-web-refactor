import { useContext } from 'react';

import { AxiosResponse } from 'axios';

import { SurveyContext } from '..';

import { usePublicSaveAnswerMutation, useSaveAnswerMutation } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { AnswerPayload } from '~/shared/api';
import {
  MixpanelEvents,
  MixpanelPayload,
  MixpanelProps,
  Mixpanel,
  addFeatureToAnalyticsPayload,
  getSurveyAnalyticsPayload,
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
    const analyticsPayload: MixpanelPayload = {
      ...getSurveyAnalyticsPayload({
        applet,
        activityId: variables.activityId,
        flowId: variables.flowId,
      }),
      [MixpanelProps.SubmitId]: variables.submitId,
    };

    if (isInMultiInformantFlow()) {
      addFeatureToAnalyticsPayload(analyticsPayload, 'Multi-informant');

      const { multiInformantAssessmentId, submitId } = getMultiInformantState();
      if (multiInformantAssessmentId) {
        analyticsPayload[MixpanelProps.MultiInformantAssessmentId] = multiInformantAssessmentId;
      }

      if (submitId === null) {
        updateMultiInformantState({
          submitId: variables.submitId,
        });
      }
    }

    Mixpanel.track(MixpanelEvents.AssessmentCompleted, analyticsPayload);

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
