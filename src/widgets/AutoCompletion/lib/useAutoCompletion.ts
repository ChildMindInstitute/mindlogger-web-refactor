import { useCallback, useContext, useState } from 'react';

import { EntityCompletionService } from '../model/EntityCompletionService';

import { appletModel } from '~/entities/applet';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import { SurveyContext, useAnswerBuilder, useSubmitAnswersMutations } from '~/features/PassSurvey';
import { useOnceEffect } from '~/shared/utils';

export const useAutoCompletion = () => {
  const context = useContext(SurveyContext);

  const [activityName, setActivityName] = useState<string>(context.activity.name);

  const completionState = AutoCompletionModel.useAutoCompletionRecord({
    entityId: context.entityId,
    eventId: context.eventId,
  });

  const { activitySuccessfullySubmitted } = AutoCompletionModel.useAutoCompletionStateManager();

  const { getActivityProgress } = appletModel.hooks.useActivityProgress();

  const answerBuilder = useAnswerBuilder();

  const { submitAnswersAsync } = useSubmitAnswersMutations({
    isPublic: !!context.publicAppletKey,
  });

  const startEntityCompletion = useCallback(async () => {
    if (!completionState) {
      throw new Error(
        '[useAutoCompletion:startEntityCompletion] AutoCompletion state is not defined',
      );
    }

    const isCompleted =
      completionState.activityIdsToSubmit.length ===
      completionState.successfullySubmittedActivityIds.length;

    if (isCompleted) {
      return;
    }

    const entityCompletionService = new EntityCompletionService(
      {
        interruptedActivityId: context.activityId,
        isPublic: !!context.publicAppletKey,
        activityIdsToSubmit: completionState?.activityIdsToSubmit || [],
        activityProgress: getActivityProgress({
          activityId: context.activityId,
          eventId: context.eventId,
        }),
        answerBuilder,
      },
      {
        onActivityFetched: (activity) => {
          setActivityName(activity.name);
        },
      },
    );

    for (const activityId of completionState.activityIdsToSubmit) {
      const answerPayload = await entityCompletionService.complete(activityId);

      const response = await submitAnswersAsync(answerPayload);

      const isSuccessful = response.status === 201;

      if (isSuccessful) {
        // Here we can handle the successful submission
        activitySuccessfullySubmitted({
          entityId: context.entityId,
          eventId: context.eventId,
          activityId,
        });
      }

      if (!isSuccessful) {
        // Here we can handle the error and re-send the correct answer if needed
      }
    }
  }, [
    activitySuccessfullySubmitted,
    answerBuilder,
    completionState,
    context.activityId,
    context.entityId,
    context.eventId,
    context.publicAppletKey,
    getActivityProgress,
    submitAnswersAsync,
  ]);

  useOnceEffect(() => {
    startEntityCompletion();
  });

  return {
    activityName,
    completionState,
  };
};
