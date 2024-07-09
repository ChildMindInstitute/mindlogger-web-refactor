import { useCallback, useContext } from 'react';

import { AxiosError } from 'axios';

import { useAutoCompletionStateManager } from './useAutoCompletionStateManager';
import { selectAutoCompletionRecord } from '../selectors';

import { ActivityPipelineType, getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { mapItemToRecord } from '~/entities/applet/model/mapper';
import { SurveyContext, useAnswer, useSubmitAnswersMutations } from '~/features/PassSurvey';
import { ActivityDTO, activityService } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';

export const useAutoCompletion = () => {
  const context = useContext(SurveyContext);

  const state = useAppSelector((state) =>
    selectAutoCompletionRecord(state, getProgressId(context.entityId, context.eventId)),
  );

  const groupProgress = useAppSelector((state) =>
    appletModel.selectors.selectGroupProgress(
      state,
      getProgressId(context.entityId, context.eventId),
    ),
  );

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    activityId: context.activityId,
    eventId: context.eventId,
    publicAppletKey: context.publicAppletKey,
    flowId: context.flow?.id ?? null,
    appletId: context.appletId,
    flow: context.flow,
  });

  const { activitySuccessfullySubmitted } = useAutoCompletionStateManager();

  const { getActivityProgress } = appletModel.hooks.useActivityProgress();

  const { buildAnswer } = useAnswer();

  const { submitAnswersAsync } = useSubmitAnswersMutations({
    isPublic: !!context.publicAppletKey,
  });

  const submitAnswersForActivity = useCallback(
    async (activityId: string) => {
      const activityProgress = getActivityProgress({
        activityId,
        eventId: context.eventId,
      });

      let activity: ActivityDTO | undefined;

      if (!activityProgress) {
        try {
          const result = await activityService.getById({ activityId });
          activity = result.data.result;
        } catch (e) {
          console.error(e);
          throw new Error(
            `[ProcessingScreen:submitAnswersForEmptyActivities] Error while fetching activity by ID: ${activityId}`,
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
        activityId,
        items: activityProgress?.items ?? items,
        userEvents: activityProgress?.userEvents ?? [],
      });

      try {
        const result = await submitAnswersAsync(answers);

        if (result.status === 201) {
          const isFlow = groupProgress?.type === ActivityPipelineType.Flow;

          if (isFlow) {
            completeFlow({ type: 'autoCompletion' });
          } else {
            completeActivity({ type: 'autoCompletion' });
          }

          activitySuccessfullySubmitted({
            entityId: context.entityId,
            eventId: context.eventId,
            activityId,
          });
        }
      } catch (e: unknown) {
        console.error(e);

        console.info(
          `[ProcessingScreen:submitAnswersForActivity] Error while submitting answers for the ActivityID: ${activityId}`,
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
      completeActivity,
      completeFlow,
      context.appletId,
      context.appletVersion,
      context.encryption,
      context.entityId,
      context.event,
      context.eventId,
      context.flow,
      context.publicAppletKey,
      getActivityProgress,
      groupProgress?.type,
      submitAnswersAsync,
    ],
  );

  const startAnswersAutoCompletion = useCallback(async () => {
    const isCompleted =
      state.activityIdsToSubmit.length === state.successfullySubmittedActivityIds.length;

    if (isCompleted) {
      return;
    }

    for (const activityId of state.activityIdsToSubmit) {
      const isAlreadySubmitted = state.successfullySubmittedActivityIds.includes(activityId);

      if (isAlreadySubmitted) {
        continue;
      }

      await submitAnswersForActivity(activityId);
    }
  }, [state.activityIdsToSubmit, state.successfullySubmittedActivityIds, submitAnswersForActivity]);

  return {
    state,
    startAnswersAutoCompletion,
  };
};
