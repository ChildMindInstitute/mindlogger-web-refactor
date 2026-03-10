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
  shouldRestart?: boolean;
};

type OnActivityCardClickProps = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  flowId: string | null;
  shouldRestart: boolean;
  /** Fresh activity IDs fetched from the API at restart time, bypassing stale cache */
  freshFlowActivityIds?: string[];
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

  const { flowRestarted, activityRestarted, getGroupProgress } =
    appletModel.hooks.useGroupProgressStateManager();

  const { removeActivityProgress } = appletModel.hooks.useActivityProgress();

  const prolificParams = useAppSelector(prolificParamsSelector);

  const { isInMultiInformantFlow, getMultiInformantState } =
    appletModel.hooks.useMultiInformantState();

  function navigateToEntity(params: NavigateToEntityProps) {
    if (!appletId) {
      return;
    }

    const { activityId, flowId, eventId, targetSubjectId, entityType, shouldRestart } = params;

    if (isPublic && publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicSurvey.navigateTo({
          appletId,
          activityId,
          eventId,
          entityType,
          publicAppletKey,
          flowId,
          shouldRestart,
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
        shouldRestart,
      }),
    );
  }

  function startSurvey({
    activityId,
    flowId,
    eventId,
    targetSubjectId,
    shouldRestart,
    freshFlowActivityIds,
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
      addFeatureToEvent(event, MixpanelFeature.Prolific);

      event[MixpanelProps.StudyUserId] = prolificParams.prolificPid;
      event[MixpanelProps.StudyReference] = prolificParams.studyId;
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

      // Fall back to stored flowActivityIds from groupProgress when the flow
      // has been deleted from the current applet version but progress still
      // exists (synced from server).
      const entityProgress = getGroupProgress({
        entityId: flowId,
        eventId,
        targetSubjectId,
      });
      const storedFlowActivityIds = (entityProgress as Record<string, unknown> | null)
        ?.flowActivityIds as string[] | undefined;

      const resolvedActivityIds =
        freshFlowActivityIds ?? flow?.activityIds ?? storedFlowActivityIds ?? [];
      const firstActivityId: string | null = resolvedActivityIds[0] ?? null;

      if (!firstActivityId) {
        throw new Error(
          '[useStartEntity:startActivityOrFlow]First activity id is not found in the flow',
        );
      }

      if (shouldRestart) {
        removeActivityProgress({ activityId, eventId, targetSubjectId });

        // Update group progress rather than remove to preserve version of event that the flow was
        // started with
        flowRestarted({
          flowId,
          eventId,
          targetSubjectId,
          activityId: firstActivityId,
          appletVersion: applet.version,
          flowActivityIds: resolvedActivityIds,
          flowName:
            flow?.name ??
            ((entityProgress as Record<string, unknown> | null)?.flowName as string) ??
            '',
        });
      } else {
        // Safety net: useEntitiesSync also clears stale progress, but may not
        // have fired yet when the user clicks "Start".
        if (!entityProgress || entityProgress.endAt) {
          removeActivityProgress({ activityId, eventId, targetSubjectId });
        }
      }

      const activityIdToNavigate = shouldRestart ? firstActivityId : activityId;

      return navigateToEntity({
        activityId: activityIdToNavigate,
        entityType: 'flow',
        eventId,
        flowId,
        targetSubjectId,
        shouldRestart,
      });
    }

    if (shouldRestart) {
      removeActivityProgress({ activityId, eventId, targetSubjectId });

      // Update group progress rather than remove to preserve version of event that the activity was
      // started with
      activityRestarted({ activityId, eventId, targetSubjectId, appletVersion: applet.version });
    } else {
      // Safety net: same as the flow branch above.
      const entityProgress = getGroupProgress({
        entityId: activityId,
        eventId,
        targetSubjectId,
      });

      if (!entityProgress || entityProgress.endAt) {
        removeActivityProgress({ activityId, eventId, targetSubjectId });
      }
    }

    return navigateToEntity({
      activityId,
      entityType: 'regular',
      eventId,
      flowId: null,
      targetSubjectId,
      shouldRestart,
    });
  }

  return {
    startSurvey,
  };
};
