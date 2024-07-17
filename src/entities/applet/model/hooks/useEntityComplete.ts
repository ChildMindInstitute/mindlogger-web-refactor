import { useCallback } from 'react';

import type { NavigateOptions } from 'react-router/dist/lib/context';

import { ActivityPipelineType } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { ActivityFlowDTO } from '~/shared/api';
import ROUTES from '~/shared/constants/routes';
import { useCustomNavigation } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

type CompletionType = 'regular' | 'autoCompletion';

type Props = {
  activityId: string;
  eventId: string;

  flowId: string | null;
  publicAppletKey: string | null;

  appletId: string;
  flow: ActivityFlowDTO | null;
};

type CompleteOptions = {
  type: CompletionType;
};

export const useEntityComplete = (props: Props) => {
  const navigator = useCustomNavigation();

  const { featureFlags } = useFeatureFlags();

  const { isInMultiInformantFlow } = appletModel.hooks.useMultiInformantState();

  const { removeActivityProgress } = appletModel.hooks.useActivityProgress();

  const { entityCompleted, flowUpdated, getGroupProgress } =
    appletModel.hooks.useGroupProgressStateManager();

  const completeEntityAndRedirect = useCallback(
    (completionType: CompletionType) => {
      entityCompleted({
        entityId: props.flowId ? props.flowId : props.activityId,
        eventId: props.eventId,
      });

      const isAutoCompletion = completionType === 'autoCompletion';

      if (isAutoCompletion) {
        return;
      }

      if (props.publicAppletKey) {
        return navigator.navigate(ROUTES.publicJoin.navigateTo(props.publicAppletKey), {
          replace: true,
        });
      }

      const navigateOptions: NavigateOptions = {
        replace: true,
      };

      if (featureFlags.enableMultiInformant && isInMultiInformantFlow()) {
        navigateOptions.state = { showTakeNowSuccessModal: true };
      }

      return navigator.navigate(ROUTES.appletDetails.navigateTo(props.appletId), navigateOptions);
    },
    [
      entityCompleted,
      featureFlags.enableMultiInformant,
      isInMultiInformantFlow,
      navigator,
      props.activityId,
      props.appletId,
      props.eventId,
      props.flowId,
      props.publicAppletKey,
    ],
  );

  const redirectToNextActivity = useCallback(
    (activityId: string) => {
      if (props.publicAppletKey) {
        return navigator.navigate(
          ROUTES.publicSurvey.navigateTo({
            appletId: props.appletId,
            activityId,
            eventId: props.eventId,
            entityType: 'flow',
            publicAppletKey: props.publicAppletKey,
            flowId: props.flowId,
          }),
          { replace: true },
        );
      }

      return navigator.navigate(
        ROUTES.survey.navigateTo({
          appletId: props.appletId,
          activityId,
          eventId: props.eventId,
          entityType: 'flow',
          flowId: props.flowId,
        }),
        { replace: true },
      );
    },
    [navigator, props.appletId, props.eventId, props.flowId, props.publicAppletKey],
  );

  const completeFlow = useCallback(
    (input?: CompleteOptions) => {
      const isAutoCompletion = input?.type === 'autoCompletion';

      const groupProgress = getGroupProgress({
        entityId: props.flowId ? props.flowId : props.activityId,
        eventId: props.eventId,
      });

      if (!groupProgress) {
        return;
      }

      const isFlow = groupProgress.type === ActivityPipelineType.Flow;

      if (!isFlow) {
        return;
      }

      const currentPipelineActivityOrder = groupProgress.pipelineActivityOrder;

      if (!props.flow) {
        throw new Error('[UseEntityComplete:completeFlow] Flow not found');
      }

      const nextActivityId = props.flow.activityIds[currentPipelineActivityOrder + 1];

      flowUpdated({
        activityId: nextActivityId ? nextActivityId : props.flow.activityIds[0],
        flowId: props.flow.id,
        eventId: props.eventId,
        pipelineActivityOrder: nextActivityId ? currentPipelineActivityOrder + 1 : 0,
      });

      removeActivityProgress({ activityId: props.activityId, eventId: props.eventId });

      if (nextActivityId && !isAutoCompletion) {
        return redirectToNextActivity(nextActivityId);
      }

      if (!nextActivityId) {
        return completeEntityAndRedirect(input?.type || 'regular');
      }
    },
    [
      completeEntityAndRedirect,
      flowUpdated,
      getGroupProgress,
      props.activityId,
      props.eventId,
      props.flow,
      props.flowId,
      redirectToNextActivity,
      removeActivityProgress,
    ],
  );

  const completeActivity = useCallback(
    (input?: CompleteOptions) => {
      removeActivityProgress({ activityId: props.activityId, eventId: props.eventId });

      return completeEntityAndRedirect(input?.type || 'regular');
    },
    [completeEntityAndRedirect, props.activityId, props.eventId, removeActivityProgress],
  );

  return {
    completeActivity,
    completeFlow,
  };
};
