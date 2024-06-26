import type { NavigateOptions } from 'react-router/dist/lib/context';

import { ActivityPipelineType } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { ActivityFlowDTO } from '~/shared/api';
import ROUTES from '~/shared/constants/routes';
import { useCustomNavigation } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

type Props = {
  activityId: string;
  eventId: string;

  flowId: string | null;
  publicAppletKey: string | null;

  appletId: string;
  flow: ActivityFlowDTO | null;
};

export const useEntityComplete = (props: Props) => {
  const navigator = useCustomNavigation();
  const { featureFlags } = useFeatureFlags();
  const { isInMultiInformantFlow } = appletModel.hooks.useMultiInformantState();

  const { removeActivityProgress } = appletModel.hooks.useActivityProgress();

  const { entityCompleted, flowUpdated, getGroupProgress } =
    appletModel.hooks.useGroupProgressState();

  const completeEntityAndRedirect = () => {
    entityCompleted({
      entityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    });

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
  };

  const redirectToNextActivity = (activityId: string) => {
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
  };

  const completeFlow = () => {
    const { flow } = props;

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

    if (!flow) {
      throw new Error('[UseEntityComplete:completeFlow] Flow not found');
    }

    const nextActivityId = flow.activityIds[currentPipelineActivityOrder + 1];

    flowUpdated({
      activityId: nextActivityId ? nextActivityId : flow.activityIds[0],
      flowId: flow.id,
      eventId: props.eventId,
      pipelineActivityOrder: nextActivityId ? currentPipelineActivityOrder + 1 : 0,
    });

    removeActivityProgress({ activityId: props.activityId, eventId: props.eventId });

    if (!nextActivityId) {
      return completeEntityAndRedirect();
    }

    return redirectToNextActivity(nextActivityId);
  };

  const completeActivity = () => {
    removeActivityProgress({ activityId: props.activityId, eventId: props.eventId });

    return completeEntityAndRedirect();
  };

  return {
    completeActivity,
    completeFlow,
  };
};
