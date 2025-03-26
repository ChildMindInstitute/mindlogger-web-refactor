import { useContext } from 'react';

import { AxiosError, AxiosResponse } from 'axios';

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
  WithProlific,
  SignupSuccessfulEvent,
} from '~/shared/utils';

type Props = {
  isPublic: boolean;
  onSubmitSuccess?: (variables: AnswerPayload) => void;
  onSubmitError?: (error?: AxiosError) => void;
};

export const useSubmitAnswersMutations = ({ isPublic, onSubmitSuccess, onSubmitError }: Props) => {
  const { isInMultiInformantFlow, getMultiInformantState, updateMultiInformantState } =
    appletModel.hooks.useMultiInformantState();

  const { applet } = useContext(SurveyContext);

  const onSuccess = (_: AxiosResponse, variables: AnswerPayload) => {
    const { prolificParams, ...restVariables } = variables;
    const assessmentCompletedEvent: WithProlific<AssessmentCompletedEvent> = addSurveyPropsToEvent(
      {
        action: MixpanelEventType.AssessmentCompleted,
        [MixpanelProps.SubmitId]: variables.submitId,
      },
      {
        applet,
        ...restVariables,
      },
    );

    if (prolificParams) {
      addFeatureToEvent(assessmentCompletedEvent, MixpanelFeature.Prolific);

      assessmentCompletedEvent[MixpanelProps.StudyUserId] = prolificParams.prolificPid;
      assessmentCompletedEvent[MixpanelProps.StudyReference] = prolificParams.studyId;
    }

    if (isInMultiInformantFlow()) {
      addFeatureToEvent(assessmentCompletedEvent, MixpanelFeature.MultiInformant);

      const { multiInformantAssessmentId, submitId } = getMultiInformantState();
      if (multiInformantAssessmentId) {
        assessmentCompletedEvent[MixpanelProps.MultiInformantAssessmentId] =
          multiInformantAssessmentId;
      }

      if (submitId === null) {
        updateMultiInformantState({
          submitId: variables.submitId,
        });
      }
    }

    Mixpanel.track(assessmentCompletedEvent);

    if (prolificParams) {
      const signupEvent: WithProlific<SignupSuccessfulEvent> = {
        action: MixpanelEventType.SignupSuccessful,
      };

      signupEvent[MixpanelProps.StudyUserId] = prolificParams.prolificPid;
      signupEvent[MixpanelProps.StudyReference] = prolificParams.studyId;

      addFeatureToEvent(signupEvent, MixpanelFeature.Prolific);

      Mixpanel.track(signupEvent);
    }

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
    onError: (error) => {
      if (error instanceof AxiosError) {
        onSubmitError?.(error);
        return;
      } else if (error instanceof Error) {
        throw error;
      }
    },
  });

  return {
    submitAnswers: isPublic ? publicSubmit : submit,
    submitAnswersAsync: isPublic ? publicSubmitAsync : submitAsync,
    isLoading: submitLoading || publicSubmitLoading,
  };
};
