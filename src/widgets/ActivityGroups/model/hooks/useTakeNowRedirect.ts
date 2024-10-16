import { useMemo } from 'react';

import { openStoreLink } from '~/abstract/lib';
import { isSupportedActivity } from '~/entities/activity';
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

  const handleTakeNowRedirect = useMemo(
    () =>
      ({
        activityId,
        eventId,
        flowId = null,
        isSupported = true,
      }: {
        activityId: string;
        eventId: string;
        flowId?: string | null;
        isSupported?: boolean;
      }) => {
        if (!isSupported) {
          openStoreLink();
          return;
        }

        startSurvey({ activityId, eventId, flowId, shouldRestart: true, targetSubjectId: null });
      },
    [startSurvey],
  );

  if (assignments && applet && events && activityOrFlowId) {
    const activity = applet.activities.find(({ id }) => id === activityOrFlowId);
    const flow = applet.activityFlows.find(({ id }) => id === activityOrFlowId);
    const event = events.find(({ entityId }) => entityId === (activity?.id || flow?.id));

    if (!event) {
      return;
    }

    if (activity) {
      return handleTakeNowRedirect({
        activityId: activity.id,
        isSupported: isSupportedActivity(activity.containsResponseTypes),
        eventId: event.id,
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
      });
    }
  }
}
