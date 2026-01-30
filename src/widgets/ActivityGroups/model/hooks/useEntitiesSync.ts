import { useCallback, useEffect, useRef } from 'react';

import { ActivityPipelineType, FlowProgress } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import {
  AppletBaseDTO,
  CompletedEntitiesDTO,
  CompletedEntityDTO,
  ScheduleEventDto,
} from '~/shared/api';

export type EntitiesSyncProps = {
  applet: AppletBaseDTO;
  completedEntities: CompletedEntitiesDTO | undefined;
  respondentSubjectId: string | null;
  events: ScheduleEventDto[];
};

export const useEntitiesSync = ({
  applet,
  completedEntities,
  respondentSubjectId,
  events,
}: EntitiesSyncProps) => {
  const { saveGroupProgress, getGroupProgress } = appletModel.hooks.useGroupProgressStateManager();

  // Create ref to exclude from callback dependencies to avoid infinite loop
  const getGroupProgressRef = useRef(getGroupProgress);

  // Syncs local GroupProgress state with server completions data.
  // Ensures the most recent event data is used the next time the activity/flow is started.
  const syncEntity = useCallback(
    (entity: CompletedEntityDTO, isFlow: boolean) => {
      const entityId = entity.id;
      const eventId = entity.scheduledEventId;

      // Normalize targetSubjectId to null for self-reports
      const targetSubjectId =
        entity.targetSubjectId === respondentSubjectId ? null : entity.targetSubjectId;

      // activityFlowOrder is 1-indexed, so it equals the 0-indexed position of the next activity
      const pipelineActivityOrder = entity.activityFlowOrder ?? 0;

      const groupProgress = getGroupProgressRef.current({
        entityId,
        eventId,
        targetSubjectId,
      });

      const event = events.find(({ id }) => id === eventId) ?? null;

      // Case 1: In-progress flow (started on another device, not yet completed)
      // Create or update resumable progress so user can continue where they left off
      if (isFlow && entity.isFlowCompleted === false) {
        const flow = applet.activityFlows.find((f) => f.id === entity.id);
        if (!flow) {
          console.warn(`[useEntitiesSync] Flow not found for entity ID: ${entity.id}`);
          return;
        }

        // Skip if local is completed and as recent or more recent than server (nothing to update)
        if ((groupProgress?.endAt ?? 0) >= entity.endTime) {
          return;
        }

        // Skip if local is in-progress and at or ahead of server (nothing to update)
        if ((groupProgress as FlowProgress)?.pipelineActivityOrder >= pipelineActivityOrder) {
          return;
        }

        const nextActivityId = flow.activityIds[pipelineActivityOrder];
        if (!nextActivityId) {
          console.warn(`[useEntitiesSync] No next activity found for flow: ${entity.id}`);
          return;
        }

        return saveGroupProgress({
          entityId,
          eventId,
          targetSubjectId,
          progressPayload: {
            type: ActivityPipelineType.Flow,
            currentActivityId: nextActivityId,
            pipelineActivityOrder,
            submitId: entity.submitId,
            startAt: groupProgress?.startAt ?? entity.startTime,
            endAt: null,
            context: groupProgress?.context ?? { summaryData: {} },
            event,
          },
        });
      }

      // Case 2: Completed entity with no local progress
      // Create a new completed record
      if (!groupProgress) {
        return saveGroupProgress({
          entityId,
          eventId,
          targetSubjectId,
          progressPayload: isFlow
            ? {
                type: ActivityPipelineType.Flow,
                currentActivityId: '',
                pipelineActivityOrder,
                submitId: entity.submitId,
                startAt: entity.startTime,
                endAt: entity.endTime,
                context: { summaryData: {} },
                event,
              }
            : {
                type: ActivityPipelineType.Regular,
                submitId: entity.submitId,
                startAt: entity.startTime,
                endAt: entity.endTime,
                context: { summaryData: {} },
                event,
              },
        });
      }

      // Case 3: Completed entity with local progress
      // Skip if local is completed and as recent or more recent than server (nothing to update)
      if ((groupProgress.endAt ?? 0) >= entity.endTime) {
        return;
      }
      return saveGroupProgress({
        entityId,
        eventId,
        targetSubjectId,
        progressPayload: isFlow
          ? {
              ...groupProgress,
              type: ActivityPipelineType.Flow,
              currentActivityId: '',
              pipelineActivityOrder,
              submitId: entity.submitId,
              startAt: entity.startTime,
              endAt: entity.endTime,
              event,
            }
          : {
              ...groupProgress,
              type: ActivityPipelineType.Regular,
              submitId: entity.submitId,
              startAt: entity.startTime,
              endAt: entity.endTime,
              event,
            },
      });
    },
    [applet.activityFlows, respondentSubjectId, events, saveGroupProgress],
  );

  useEffect(() => {
    if (completedEntities) {
      completedEntities.activities.forEach((entity) => syncEntity(entity, false));
      completedEntities.activityFlows.forEach((entity) => syncEntity(entity, true));
    }
  }, [completedEntities, syncEntity]);
};
