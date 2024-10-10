import { useMemo } from 'react';

import { openStoreLink } from '~/abstract/lib';
import { isSupportedActivity } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { useStartSurvey } from '~/features/PassSurvey';
import { AppletBaseDTO, AppletEventsResponse, HydratedAssignmentDTO } from '~/shared/api';

export function useTakeNowRedirect({
  activityOrFlowId,
  applet,
  assignments = [],
  events = [],
  isPublic = false,
  publicAppletKey = null,
}: {
  activityOrFlowId?: string | null;
  applet?: AppletBaseDTO;
  assignments?: HydratedAssignmentDTO[] | null;
  events?: AppletEventsResponse['events'];
  isPublic?: boolean;
  publicAppletKey?: string | null;
}) {
  const { startSurvey } = useStartSurvey({ applet, isPublic, publicAppletKey });
  const { getMultiInformantState } = appletModel.hooks.useMultiInformantState();

  const handleTakeNowRedirect = useMemo(
    () =>
      ({
        activityId,
        eventId,
        flowId = null,
        isSupported = true,
        targetSubjectId = null,
      }: {
        activityId: string;
        eventId: string;
        flowId?: string | null;
        isSupported?: boolean;
        targetSubjectId?: string | null;
      }) => {
        if (!isSupported) {
          openStoreLink();
          return;
        }

        startSurvey({ activityId, eventId, flowId, shouldRestart: true, targetSubjectId });
      },
    [startSurvey],
  );

  if (assignments && applet && events && activityOrFlowId) {
    const activity = applet.activities.find(({ id }) => id === activityOrFlowId);
    const flow = applet.activityFlows.find(({ id }) => id === activityOrFlowId);
    const event = events.find(({ entityId }) => entityId === (activity?.id || flow?.id));
    const { targetSubject } = getMultiInformantState();

    if (!event) {
      return;
    }

    if (activity) {
      return handleTakeNowRedirect({
        activityId: activity.id,
        isSupported: isSupportedActivity(activity.containsResponseTypes),
        eventId: event.id,
        targetSubjectId: targetSubject?.id,
      });
    }

    if (flow) {
      const flowActivities = flow.activityIds.map((activityId) =>
        applet.activities.find(({ id }) => activityId === id),
      );

      return handleTakeNowRedirect({
        activityId: flow.activityIds[0],
        isSupported: flowActivities.every(
          (activity) => !!activity && isSupportedActivity(activity.containsResponseTypes),
        ),
        eventId: event.id,
        flowId: flow.id,
        targetSubjectId: targetSubject?.id,
      });
    }
  }
}
