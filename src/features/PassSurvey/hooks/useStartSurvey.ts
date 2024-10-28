import { EntityType } from '~/abstract/lib/GroupBuilder';
import { appletModel } from '~/entities/applet';
import { AppletBaseDTO } from '~/shared/api';
import ROUTES from '~/shared/constants/routes';
import {
  MixpanelEventType,
  MixpanelProps,
  Mixpanel,
  useCustomNavigation,
  AssessmentStartedEvent,
} from '~/shared/utils';

type NavigateToEntityProps = {
  flowId: string | null;
  activityId: string;
  targetSubjectId: string | null;
  entityType: EntityType;
  eventId: string;
};

type OnActivityCardClickProps = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  flowId: string | null;
  shouldRestart: boolean;
};

type Props = {
  applet?: AppletBaseDTO;
  isPublic: boolean;
  publicAppletKey: string | null;
};

export const useStartSurvey = (props: Props) => {
  const navigator = useCustomNavigation();
  const appletId = props.applet?.id;
  const flows = props.applet?.activityFlows;

  const { removeGroupProgress } = appletModel.hooks.useGroupProgressStateManager();

  const { removeActivityProgress } = appletModel.hooks.useActivityProgress();

  const { isInMultiInformantFlow, getMultiInformantState } =
    appletModel.hooks.useMultiInformantState();

  function navigateToEntity(params: NavigateToEntityProps) {
    if (!appletId) {
      return;
    }

    const { activityId, flowId, eventId, targetSubjectId, entityType } = params;

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
        targetSubjectId,
        entityType,
        flowId,
      }),
    );
  }

  function startSurvey({
    activityId,
    flowId,
    eventId,
    targetSubjectId,
    shouldRestart,
  }: OnActivityCardClickProps) {
    const event: AssessmentStartedEvent = {
      action: MixpanelEventType.AssessmentStarted,
      [MixpanelProps.AppletId]: appletId,
      [MixpanelProps.ActivityId]: activityId,
    };

    if (flowId) {
      event[MixpanelProps.ActivityFlowId] = flowId;
    }

    if (isInMultiInformantFlow()) {
      event[MixpanelProps.Feature] = 'Multi-informant';

      const { multiInformantAssessmentId } = getMultiInformantState();
      if (multiInformantAssessmentId) {
        event[MixpanelProps.MultiInformantAssessmentId] = multiInformantAssessmentId;
      }
    }

    Mixpanel.track(event);

    if (flowId) {
      const flow = flows?.find((x) => x.id === flowId);
      const firstActivityId: string | null = flow?.activityIds[0] ?? null;

      if (!firstActivityId) {
        throw new Error(
          '[useStartEntity:startActivityOrFlow]First activity id is not found in the flow',
        );
      }

      if (shouldRestart) {
        removeActivityProgress({ activityId, eventId, targetSubjectId });
        removeGroupProgress({ entityId: flowId, eventId, targetSubjectId });
      }

      const activityIdToNavigate = shouldRestart ? firstActivityId : activityId;

      return navigateToEntity({
        activityId: activityIdToNavigate,
        entityType: 'flow',
        eventId,
        flowId,
        targetSubjectId,
      });
    }

    if (shouldRestart) {
      removeActivityProgress({ activityId, eventId, targetSubjectId });
      removeGroupProgress({ entityId: activityId, eventId, targetSubjectId });
    }

    return navigateToEntity({
      activityId,
      entityType: 'regular',
      eventId,
      flowId: null,
      targetSubjectId,
    });
  }

  return {
    startSurvey,
  };
};
