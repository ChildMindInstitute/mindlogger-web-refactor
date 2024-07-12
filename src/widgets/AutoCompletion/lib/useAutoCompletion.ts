import { useCallback, useContext, useState } from 'react';

import { appletModel } from '~/entities/applet';
import { mapItemToRecord } from '~/entities/applet/model/mapper';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import { SurveyContext, useAnswer, useSubmitAnswersMutations } from '~/features/PassSurvey';
import { ActivityApiProxyService, ActivityDTO, AnswerPayload } from '~/shared/api';

type Item = appletModel.ItemRecord;

type CompleteActivityParams = {
  activityId: string;
  items: Item[];
  userEvents: appletModel.UserEvent[];
  isLastActivity: boolean;
};

export const useAutoCompletion = () => {
  const context = useContext(SurveyContext);

  const [activityName, setActivityName] = useState<string>(context.activity.name);

  const completionState = AutoCompletionModel.useAutoCompletionRecord({
    entityId: context.entityId,
    eventId: context.eventId,
  });

  const { activitySuccessfullySubmitted } = AutoCompletionModel.useAutoCompletionStateManager();

  const { getActivityProgress } = appletModel.hooks.useActivityProgress();

  const { buildAnswer } = useAnswer();

  const { submitAnswersAsync } = useSubmitAnswersMutations({
    isPublic: !!context.publicAppletKey,
  });

  const isLastActivity = useCallback(
    (activityId: string) => {
      if (!completionState) {
        throw new Error('[useAutoCompletion:isLastActivity] AutoCompletion state is not defined');
      }

      const lastIndex = completionState.activityIdsToSubmit.length - 1;

      return completionState.activityIdsToSubmit[lastIndex] === activityId;
    },
    [completionState],
  );

  const fetchActivityById = useCallback(
    async (id: string): Promise<ActivityDTO> => {
      let activityDTO: ActivityDTO | undefined;

      try {
        const response = await ActivityApiProxyService.getActivityById(id, {
          isPublic: !!context.publicAppletKey,
        });

        activityDTO = response.data.result;
      } catch (error) {
        console.error(error);
        throw new Error(
          `[CompletionContructService:getActivityById] Error while fetching activity by ID: ${id}`,
        );
      }

      setActivityName(activityDTO.name);
      return activityDTO;
    },
    [context.publicAppletKey],
  );

  const completeActivity = useCallback(
    async (params: CompleteActivityParams): Promise<boolean> => {
      const answerPayload: AnswerPayload = buildAnswer({
        entityId: context.entityId,
        event: context.event,
        appletId: context.appletId,
        appletVersion: context.appletVersion,
        encryption: context.encryption,
        flow: context.flow,
        publicAppletKey: context.publicAppletKey,
        activityId: params.activityId,
        items: params.items,
        userEvents: params.userEvents,
        isFlowCompleted: params.isLastActivity,
      });

      const response = await submitAnswersAsync(answerPayload);

      const isSuccessful = response.status === 201;

      if (isSuccessful) {
        // Here we can handle the successful submission
        activitySuccessfullySubmitted({
          entityId: context.entityId,
          eventId: context.eventId,
          activityId: params.activityId,
        });
      }

      if (!isSuccessful) {
        // Here we can handle the error and re-send the correct answer if needed
      }

      return isSuccessful;
    },
    [
      activitySuccessfullySubmitted,
      buildAnswer,
      context.appletId,
      context.appletVersion,
      context.encryption,
      context.entityId,
      context.event,
      context.eventId,
      context.flow,
      context.publicAppletKey,
      submitAnswersAsync,
    ],
  );

  const completeEmptyActivity = useCallback(
    async (activityId: string) => {
      const activityDTO = await fetchActivityById(activityId);

      const items = activityDTO.items.map(mapItemToRecord);

      const isCompleted = await completeActivity({
        activityId,
        items,
        userEvents: [],
        isLastActivity: isLastActivity(activityId),
      });

      return isCompleted;
    },
    [completeActivity, fetchActivityById, isLastActivity],
  );

  const completeInterruptedActivity = useCallback(async () => {
    const activityProgress = getActivityProgress({
      activityId: context.activityId,
      eventId: context.eventId,
    });

    if (!activityProgress) {
      throw new Error(
        `[useAutoCompletion:startEntityCompletion] Activity progress is not found for activityId: ${context.activityId} and eventId: ${context.eventId}`,
      );
    }

    const isCompleted = await completeActivity({
      activityId: context.activityId,
      items: activityProgress.items,
      userEvents: activityProgress.userEvents,
      isLastActivity: isLastActivity(context.activityId),
    });

    return isCompleted;
  }, [completeActivity, context.activityId, context.eventId, getActivityProgress, isLastActivity]);

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

    const interruptedActivityId = context.activityId;

    for (const activityId of completionState.activityIdsToSubmit) {
      if (activityId === interruptedActivityId) {
        await completeInterruptedActivity();
      } else {
        await completeEmptyActivity(activityId);
      }
    }
  }, [completeEmptyActivity, completeInterruptedActivity, completionState, context.activityId]);

  return {
    activityName,
    completionState,
    startEntityCompletion,
  };
};
