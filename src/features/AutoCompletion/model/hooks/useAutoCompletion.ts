import { useCallback, useContext } from 'react';

import { useAutoCompletionRecord } from './useAutoCompletionRecord';
import { useAutoCompletionStateManager } from './useAutoCompletionStateManager';
import { CompletionContructService } from '../CompletionConstructService';

import { useActivityByIdMutation } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { SurveyContext, useAnswer, useSubmitAnswersMutations } from '~/features/PassSurvey';
import { usePrevious } from '~/shared/utils';

export const useAutoCompletion = () => {
  const context = useContext(SurveyContext);

  const { mutateAsync: fetchActivityById, data } = useActivityByIdMutation({
    isPublic: !!context.publicAppletKey,
  });

  const prevFetchedActivity = usePrevious(data?.data.result);

  // The latest fetched activity name
  // If the latest fetched activity name is not available, return the previous fetched activity name
  // If no activity name is available, return the current activity name
  const latestActivityName = data?.data?.result?.name;
  const prevActivityName = prevFetchedActivity?.name;
  const currentActivityName = context.activity.name;

  const activityName = latestActivityName ?? prevActivityName ?? currentActivityName;

  const state = useAutoCompletionRecord({ entityId: context.entityId, eventId: context.eventId });

  const { activitySuccessfullySubmitted } = useAutoCompletionStateManager();

  const { getActivityProgress } = appletModel.hooks.useActivityProgress();

  const { buildAnswer } = useAnswer();

  const { submitAnswersAsync } = useSubmitAnswersMutations({
    isPublic: !!context.publicAppletKey,
  });

  const startEntityCompletion = useCallback(async () => {
    if (!state) {
      throw new Error(
        '[useAutoCompletion:startEntityCompletion] AutoCompletion state is not defined',
      );
    }

    const isCompleted =
      state.activityIdsToSubmit.length === state.successfullySubmittedActivityIds.length;

    if (isCompleted) {
      return;
    }

    const activityProgress = getActivityProgress({
      activityId: context.activityId,
      eventId: context.eventId,
    });

    if (!activityProgress) {
      throw new Error(
        `[useAutoCompletion:startEntityCompletion] Activity progress is not found for activityId: ${context.activityId} and eventId: ${context.eventId}`,
      );
    }

    const completionService = new CompletionContructService({
      surveyContext: context,
      completionRecord: state,
      interruptedProgress: activityProgress,
      fetchActivityById,
      submitAnswers: submitAnswersAsync,
      buildAnswer,
      activitySuccessfullySubmitted,
    });

    await completionService.complete();
  }, [
    activitySuccessfullySubmitted,
    buildAnswer,
    context,
    fetchActivityById,
    getActivityProgress,
    state,
    submitAnswersAsync,
  ]);

  return {
    activityName,
    state,
    startEntityCompletion,
  };
};
