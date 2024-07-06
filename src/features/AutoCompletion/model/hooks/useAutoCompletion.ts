import { useCallback, useContext } from 'react';

import { useAutoCompletionState } from './useAutoCompletionState';
import { autoCompletionSelector } from '../selectors';

import { ActivityPipelineType, getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { mapItemToRecord } from '~/entities/applet/model/mapper';
import { SurveyContext, useAnswer, useSubmitAnswersMutations } from '~/features/PassSurvey';
import { ActivityDTO, activityService } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';

type SubmitAnswersPayload = {
  userEvents: appletModel.UserEvent[];
  items: appletModel.ItemRecord[];
  activityId: string;
};

export const useAutoCompletion = () => {
  const context = useContext(SurveyContext);

  const state = useAppSelector((state) =>
    autoCompletionSelector(state, getProgressId(context.entityId, context.eventId)),
  );

  const { activitySuccessfullySubmitted } = useAutoCompletionState();

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const { getActivityProgress } = appletModel.hooks.useActivityProgress();

  const { buildAnswer } = useAnswer();

  const { submitAnswersAsync } = useSubmitAnswersMutations({
    isPublic: !!context.publicAppletKey,
  });

  const submitAnswersForActivity = useCallback(
    async (params: SubmitAnswersPayload) => {
      const answers = buildAnswer({
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
      });

      try {
        const result = await submitAnswersAsync(answers);

        console.log(`[ProcessingScreen:submitAnswersForActivity]`, result);

        if (result.status === 201) {
          activitySuccessfullySubmitted({
            entityId: context.entityId,
            eventId: context.eventId,
            activityId: params.activityId,
          });
        }
      } catch (e) {
        console.error(e);
        throw new Error(
          '[ProcessingScreen:submitAnswersForActivity] Error while submitting answers',
        );
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
      submitAnswersAsync,
    ],
  );

  const submitAnswersForInteruptedActivity = useCallback(async () => {
    const acitivtyProgress = getActivityProgress({
      activityId: context.activityId,
      eventId: context.eventId,
    });

    if (!acitivtyProgress) {
      throw new Error(
        '[ProcessingScreen:submitAnswersForInteruptedActivity] Activity progress is not found',
      );
    }

    const isAlreadySubmitted = state.successfullySubmittedActivityIds.includes(context.activityId);

    if (isAlreadySubmitted) {
      return;
    }

    await submitAnswersForActivity({
      items: acitivtyProgress.items,
      userEvents: acitivtyProgress.userEvents,
      activityId: context.activityId,
    });
  }, [
    context.activityId,
    context.eventId,
    getActivityProgress,
    state.successfullySubmittedActivityIds,
    submitAnswersForActivity,
  ]);

  const submitAnswersForEmptyActivities = useCallback(
    async (activityId: string) => {
      let activity: ActivityDTO | undefined;

      try {
        const result = await activityService.getById({ activityId });
        activity = result.data.result;
      } catch (e) {
        console.log(e);
        throw new Error(
          `[ProcessingScreen:submitAnswersForEmptyActivities] Error while fetching activity by ID: ${activityId}`,
        );
      }

      const items = activity.items.map((item) => mapItemToRecord(item));

      await submitAnswersForActivity({
        items,
        userEvents: [],
        activityId,
      });
    },
    [submitAnswersForActivity],
  );

  const startAnswersAutoCompletion = useCallback(async () => {
    console.log('[ProcessingScreen] autoSubmitAnswers');

    const groupProgress = getGroupProgress({
      entityId: context.entityId,
      eventId: context.eventId,
    });

    if (!groupProgress) {
      throw new Error('[ProcessingScreen] Group progress is not found');
    }

    const isRegularActivity = groupProgress.type === ActivityPipelineType.Regular;

    if (isRegularActivity) {
      return submitAnswersForInteruptedActivity();
    }

    if (!isRegularActivity && context.flow) {
      await submitAnswersForInteruptedActivity();

      for (const activityId of state.activityIdsToSubmit) {
        const isAlreadySubmitted = state.successfullySubmittedActivityIds.includes(activityId);

        if (isAlreadySubmitted) {
          continue;
        }

        await submitAnswersForEmptyActivities(activityId);
      }
    }
  }, [
    context.entityId,
    context.eventId,
    context.flow,
    getGroupProgress,
    state.activityIdsToSubmit,
    state.successfullySubmittedActivityIds,
    submitAnswersForEmptyActivities,
    submitAnswersForInteruptedActivity,
  ]);

  return {
    state,
    startAnswersAutoCompletion,
  };
};
