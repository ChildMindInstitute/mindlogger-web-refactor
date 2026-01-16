import { useCallback, useEffect, useRef } from 'react';

import { v4 as uuidV4 } from 'uuid';

import { ActivityPipelineType } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { CompletedEntitiesDTO, CompletedEntityDTO, ScheduleEventDto } from '~/shared/api';

type EntitiesSyncProps = {
  completedEntities: CompletedEntitiesDTO | undefined;
  respondentSubjectId: string | null;
  events: ScheduleEventDto[];
};

export const useEntitiesSync = ({
  completedEntities,
  respondentSubjectId,
  events,
}: EntitiesSyncProps) => {
  const { saveGroupProgress, getGroupProgress } = appletModel.hooks.useGroupProgressStateManager();

  // Create ref to exclude from callback dependencies to avoid infinite loop
  const getGroupProgressRef = useRef(getGroupProgress);

  // Updates GroupProgress state whenever an activity/flow is completed to align with completions
  // data. Syncs with latest event data from the BE to ensure the most recent event data is used
  // the next time the activity/flow is started.
  const syncEntity = useCallback(
    (entity: CompletedEntityDTO) => {
      const endAtDate = new Date(`${entity.localEndDate}T${entity.localEndTime}`);
      const endAtTimestamp = endAtDate.getTime();

      const entityId = entity.flowHistoryId ?? entity.activityHistoryId;
      const eventId = entity.scheduledEventId;
      // Normalize targetSubjectId to null for self-reports
      const targetSubjectId =
        entity.targetSubjectId === respondentSubjectId ? null : entity.targetSubjectId;

      const groupProgress = getGroupProgressRef.current({
        entityId,
        eventId,
        targetSubjectId,
      });

      const event = events.find(({ id }) => id === eventId) ?? null;

      if (!groupProgress) {
        return saveGroupProgress({
          entityId,
          eventId,
          targetSubjectId,
          progressPayload: {
            type: ActivityPipelineType.Regular,
            startAt: null,
            endAt: endAtTimestamp,
            submitId: uuidV4(),
            context: {
              summaryData: {},
            },
            event,
          },
        });
      } else if (groupProgress.endAt) {
        let { endAt } = groupProgress;

        const isServerEndAtBigger = endAtTimestamp > new Date(groupProgress.endAt).getTime();

        if (isServerEndAtBigger) {
          endAt = endAtTimestamp;
        }

        return saveGroupProgress({
          entityId,
          eventId,
          targetSubjectId,
          progressPayload: {
            ...groupProgress,
            endAt,
            event,
          },
        });
      }
    },
    [respondentSubjectId, events, saveGroupProgress],
  );

  useEffect(() => {
    if (!completedEntities) {
      return;
    }

    [...completedEntities.activities, ...completedEntities.activityFlows].forEach(syncEntity);
  }, [completedEntities, syncEntity]);
};
