import { ActivityPipelineType } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { AppletDetailsDTO } from '~/shared/api';
import { ROUTES } from '~/shared/constants';
import { useNotification } from '~/shared/ui';
import { useCustomNavigation, useCustomTranslation } from '~/shared/utils';

type Props = {
  applet: AppletDetailsDTO;
  activityId: string;
  eventId: string;

  flowId: string | null;
  publicAppletKey: string | null;
};

export const useEntityComplete = (props: Props) => {
  const navigator = useCustomNavigation();
  const { t } = useCustomTranslation();

  const { removeActivityProgress } = appletModel.hooks.useRemoveActivityProgress();

  const { entityCompleted, flowUpdated, getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const { showSuccessNotification } = useNotification();

  const completeEntityAndRedirect = () => {
    entityCompleted({
      entityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    });

    showSuccessNotification(t('toast.answers_submitted'));

    if (props.publicAppletKey) {
      return navigator.navigate(ROUTES.publicJoin.navigateTo(props.publicAppletKey), {
        replace: true,
      });
    }

    return navigator.navigate(ROUTES.appletDetails.navigateTo(props.applet.id), {
      replace: true,
    });
  };

  const redirectToNextActivity = (activityId: string) => {
    showSuccessNotification(t('toast.next_activity'));

    if (props.publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicActivityDetails.navigateTo({
          appletId: props.applet.id,
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
      ROUTES.activityDetails.navigateTo({
        appletId: props.applet.id,
        activityId,
        eventId: props.eventId,
        entityType: 'flow',
        flowId: props.flowId,
      }),
      { replace: true },
    );
  };

  const completeFlow = (flowId: string) => {
    const { activityFlows } = props.applet;

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

    const currentFlow = activityFlows.find(flow => flow.id === flowId)!;

    const nextActivityId = currentFlow.activityIds[currentPipelineActivityOrder + 1];

    flowUpdated({
      activityId: nextActivityId ? nextActivityId : currentFlow.activityIds[0],
      flowId: currentFlow.id,
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
