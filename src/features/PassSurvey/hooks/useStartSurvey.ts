import { EntityType } from '~/abstract/lib/GroupBuilder';
import { appletModel } from '~/entities/applet';
import { prolificParamsSelector } from '~/entities/applet/model/selectors';
import { AppletBaseDTO } from '~/shared/api';
import ROUTES from '~/shared/constants/routes';
import {
  MixpanelEventType,
  MixpanelProps,
  Mixpanel,
  useCustomNavigation,
  AssessmentStartedEvent,
  useAppSelector,
} from '~/shared/utils';
import {
  addFeatureToEvent,
  addSurveyPropsToEvent,
  MixpanelFeature,
  WithProlific,
} from '~/shared/utils/analytics';

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

export const useStartSurvey = ({ applet, isPublic, publicAppletKey }: Props) => {
  const navigator = useCustomNavigation();
  const appletId = applet?.id;
  const flows = applet?.activityFlows;

  const { removeGroupProgress } = appletModel.hooks.useGroupProgressStateManager();

  const { removeActivityProgress } = appletModel.hooks.useActivityProgress();

  const prolificParams = useAppSelector(prolificParamsSelector);

  const { isInMultiInformantFlow, getMultiInformantState } =
    appletModel.hooks.useMultiInformantState();

  function navigateToEntity(params: NavigateToEntityProps) {
    if (!appletId) {
      return;
    }

    const { activityId, flowId, eventId, targetSubjectId, entityType } = params;

    if (isPublic && publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicSurvey.navigateTo({
          appletId,
          activityId,
          eventId,
          entityType,
          publicAppletKey,
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
    if (!applet) return;

    const event: WithProlific<AssessmentStartedEvent> = addSurveyPropsToEvent(
      { action: MixpanelEventType.AssessmentStarted },
      {
        applet,
        activityId,
        flowId,
      },
    );

    if (prolificParams) {
      event[MixpanelProps.ProlificPid] = prolificParams.prolificPid;
      event[MixpanelProps.ProlificStudyId] = prolificParams.studyId;
    }

    if (isInMultiInformantFlow()) {
      addFeatureToEvent(event, MixpanelFeature.MultiInformant);

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
