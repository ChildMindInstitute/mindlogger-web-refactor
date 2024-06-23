import { ActivityStatus, EntityType } from '~/abstract/lib/GroupBuilder';
import { appletModel } from '~/entities/applet';
import { AppletBaseDTO } from '~/shared/api';
import ROUTES from '~/shared/constants/routes';
import { MixEvents, MixProperties, Mixpanel, useCustomNavigation } from '~/shared/utils';

type NavigateToEntityProps = {
  flowId: string | null;
  activityId: string;
  entityType: EntityType;
  eventId: string;
};

type OnActivityCardClickProps = {
  activityId: string;
  eventId: string;
  flowId: string | null;
  status: ActivityStatus;
  shouldRestart: boolean;
};

type Props = {
  applet: AppletBaseDTO;
  isPublic: boolean;
  publicAppletKey: string | null;
};

export const useStartSurvey = (props: Props) => {
  const navigator = useCustomNavigation();

  const appletId = props.applet.id;
  const flows = props.applet.activityFlows;

  const { removeGroupProgress } = appletModel.hooks.useGroupProgressState();

  const { removeActivityProgress } = appletModel.hooks.useActivityProgress();

  function navigateToEntity(params: NavigateToEntityProps) {
    const { activityId, flowId, eventId, entityType } = params;

    if (props.isPublic && props.publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicSurvey.navigateTo({
          appletId,
          activityId,
          eventId,
          entityType,
          publicAppletKey: props.publicAppletKey,
          flowId,
        }),
      );
    }

    return navigator.navigate(
      ROUTES.survey.navigateTo({
        appletId,
        activityId,
        eventId,
        entityType,
        flowId,
      }),
    );
  }

  function startSurvey(params: OnActivityCardClickProps) {
    Mixpanel.track(MixEvents.AssessmentStarted, { [MixProperties.AppletId]: props.applet.id });

    const { flowId, eventId, activityId, shouldRestart } = params;

    if (flowId) {
      const flow = flows.find((x) => x.id === flowId);
      const firstActivityId: string | null = flow?.activityIds[0] ?? null;

      if (!firstActivityId) {
        throw new Error(
          '[useStartEntity:startActivityOrFlow]First activity id is not found in the flow',
        );
      }

      if (shouldRestart) {
        removeActivityProgress({ activityId, eventId });
        removeGroupProgress({ entityId: flowId, eventId });
      }

      const activityIdToNavigate = shouldRestart ? firstActivityId : activityId;

      return navigateToEntity({
        activityId: activityIdToNavigate,
        entityType: 'flow',
        eventId,
        flowId,
      });
    }

    if (shouldRestart) {
      removeActivityProgress({ activityId, eventId });
      removeGroupProgress({ entityId: activityId, eventId });
    }

    return navigateToEntity({
      activityId,
      entityType: 'regular',
      eventId,
      flowId: null,
    });
  }

  return {
    startSurvey,
  };
};