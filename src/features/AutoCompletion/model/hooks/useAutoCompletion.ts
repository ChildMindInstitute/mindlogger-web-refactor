import { useCallback, useContext, useMemo } from 'react';

import { AxiosError } from 'axios';

import { useAutoCompletionRecord } from './useAutoCompletionRecord';
import { useAutoCompletionStateManager } from './useAutoCompletionStateManager';
import { usePrevious } from '../../../../shared/utils';

import { useActivityByIdMutation } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { mapItemToRecord } from '~/entities/applet/model/mapper';
import { SurveyContext, useAnswer, useSubmitAnswersMutations } from '~/features/PassSurvey';
import { ActivityDTO } from '~/shared/api';

type SubmitParams = {
  activityId: string;
  isLastActivity: boolean;
};

export const useAutoCompletion = () => {
  const context = useContext(SurveyContext);

  const { mutateAsync: fetchActivityById, data } = useActivityByIdMutation({
    isPublic: !!context.publicAppletKey,
  });

  const prevFetchedActivity = usePrevious(data?.data.result);

  const activityName = useMemo(() => {
    // The latest fetched activity name
    if (data?.data?.result?.name) {
      return data?.data?.result?.name;
    }

    // If the latest fetched activity name is not available, return the previous fetched activity name
    if (prevFetchedActivity?.name) {
      return prevFetchedActivity?.name;
    }

    // If no activity name is available, return the current activity name
    return context.activity.name;
  }, [context.activity.name, data?.data?.result?.name, prevFetchedActivity?.name]);

  const state = useAutoCompletionRecord({ entityId: context.entityId, eventId: context.eventId });

  const { activitySuccessfullySubmitted } = useAutoCompletionStateManager();

  const { getActivityProgress } = appletModel.hooks.useActivityProgress();

  const { buildAnswer } = useAnswer();

  const { submitAnswersAsync } = useSubmitAnswersMutations({
    isPublic: !!context.publicAppletKey,
  });

  const submitAnswersForActivity = useCallback(
    async (params: SubmitParams) => {
      const activityProgress = getActivityProgress({
        activityId: params.activityId,
        eventId: context.eventId,
      });

      let activity: ActivityDTO | undefined;

      if (!activityProgress) {
        try {
          const result = await fetchActivityById(params.activityId);
          activity = result.data.result;
        } catch (e) {
          console.error(e);
          throw new Error(
            `[ProcessingScreen:submitAnswersForEmptyActivities] Error while fetching activity by ID: ${params.activityId}`,
          );
        }
      }

      const items = activity?.items.map(mapItemToRecord) ?? [];

      const answers = buildAnswer({
        entityId: context.entityId,
        event: context.event,
        appletId: context.appletId,
        appletVersion: context.appletVersion,
        encryption: context.encryption,
        flow: context.flow,
        publicAppletKey: context.publicAppletKey,
        activityId: params.activityId,
        items: activityProgress?.items ?? items,
        userEvents: activityProgress?.userEvents ?? [],
        isFlowCompleted: params.isLastActivity,
      });

      try {
        const result = await submitAnswersAsync(answers);

        if (result.status === 201) {
          activitySuccessfullySubmitted({
            entityId: context.entityId,
            eventId: context.eventId,
            activityId: params.activityId,
          });
        }
      } catch (e: unknown) {
        // We should not throw an error here and stop the process
        // because we have a chance to get the validation error "Incorrect answer order".

        // Need to discuss with the backend team the implementation of the specific error to determine the required answer.
        // Now error message - "Incorrect activity order" is not informative enough.
        // Good error message - { type: "INCORRECT_ANSWER_ORDER", expected: {activityId} }. Then we can handle it and send the correct answer.
        console.error(e);

        console.info(
          `[ProcessingScreen:submitAnswersForActivity] Error while submitting answers for the ActivityID: ${params.activityId}`,
        );

        if (e instanceof AxiosError) {
          console.error(
            `[ProcessingScreen:submitAnswersForActivity] Error: ${e.response?.data.result[0].message}`,
          );
        }
      }
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
      fetchActivityById,
      getActivityProgress,
      submitAnswersAsync,
    ],
  );

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

    for (const activityId of state.activityIdsToSubmit) {
      const isAlreadySubmitted = state.successfullySubmittedActivityIds.includes(activityId);

      const isLastActivity =
        state.activityIdsToSubmit[state.activityIdsToSubmit.length - 1] === activityId;

      if (isAlreadySubmitted) {
        continue;
      }

      await submitAnswersForActivity({
        activityId,
        isLastActivity,
      });
    }
  }, [state, submitAnswersForActivity]);

  return {
    activityName,
    state,
    startEntityCompletion,
  };
};
