import { useCallback, useContext } from 'react';

import { useAutoCompletionState } from './useAutoCompletionState';

import { ActivityPipelineType } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { mapItemToRecord } from '~/entities/applet/model/mapper';
import { SurveyContext, useAnswer, useSubmitAnswersMutations } from '~/features/PassSurvey';
import { ActivityDTO, activityService } from '~/shared/api';

type SubmitAnswersPayload = {
  userEvents: appletModel.UserEvent[];
  items: appletModel.ItemRecord[];
  activityId: string;
};

export const useAutoCompletion = () => {
  const context = useContext(SurveyContext);

  const { state, action } = useAutoCompletionState();

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const { getActivityProgress } = appletModel.hooks.useActivityProgress();

  const { buildAnswer } = useAnswer();

  const { submitAnswersAsync } = useSubmitAnswersMutations({
    isPublic: !!context.publicAppletKey,
  });

  const submitAnswersForActivity = useCallback(
    async (params: SubmitAnswersPayload) => {
      action.incrementActivityIndex();
      action.setCurrentActivityId(params.activityId);

      const answers = buildAnswer({
        entityId: context.entityId,
        event: context.event,
        appletId: context.appletId,
        appletVersion: context.appletVersion,
        encryption: context.encryption,
        flow: context.flow,
        publicAppletKey: context.publicAppletKey,
        activityId: params.activityId,
        userEvents: params.userEvents,
        items: params.items,
      });

      try {
        await submitAnswersAsync(answers);
      } catch (e) {
        console.error(e);
        throw new Error(
          '[ProcessingScreen:submitAnswersForActivity] Error while submitting answers',
        );
      }
    },
    [
      action,
      buildAnswer,
      context.appletId,
      context.appletVersion,
      context.encryption,
      context.entityId,
      context.event,
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

    await submitAnswersForActivity({
      items: acitivtyProgress.items,
      userEvents: acitivtyProgress.userEvents,
      activityId: context.activityId,
    });
  }, [context.activityId, context.eventId, getActivityProgress, submitAnswersForActivity]);

  const submitAnswersForEmptyActivities = useCallback(
    async (activityId: string) => {
      let activity: ActivityDTO | undefined;

      try {
        const resutl = await activityService.getById({ activityId });
        activity = resutl.data.result;
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

  const autoSubmitAnswers = useCallback(async () => {
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
      action.setActivitiesCount(1);
      return submitAnswersForInteruptedActivity();
    }

    if (!isRegularActivity && context.flow) {
      const activitiesInFlow = context.flow.activityIds.length;

      const activitiesRestInFlow = activitiesInFlow - groupProgress.pipelineActivityOrder;

      action.setActivitiesCount(activitiesRestInFlow);

      await submitAnswersForInteruptedActivity();

      const restActivityIds = context.flow.activityIds.slice(
        groupProgress.pipelineActivityOrder + 1,
        context.flow.activityIds.length,
      );

      for (const activityId of restActivityIds) {
        await submitAnswersForEmptyActivities(activityId);
      }
    }
  }, [
    action,
    context.entityId,
    context.eventId,
    context.flow,
    getGroupProgress,
    submitAnswersForEmptyActivities,
    submitAnswersForInteruptedActivity,
  ]);

  return {
    state,
    autoSubmitAnswers,
  };
};
