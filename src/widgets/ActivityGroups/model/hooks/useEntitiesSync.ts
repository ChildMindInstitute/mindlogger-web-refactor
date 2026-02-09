import { useCallback, useEffect, useRef } from 'react';

import { v4 as uuidV4 } from 'uuid';

import { ActivityPipelineType, FlowProgress } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import {
  ActivityFlowDTO,
  CompletedEntitiesDTO,
  CompletedEntityDTO,
  ScheduleEventDto,
} from '~/shared/api';

export type EntitiesSyncProps = {
  completedEntities: CompletedEntitiesDTO | undefined;
  respondentSubjectId: string | null;
  events: ScheduleEventDto[];
  activityFlows: ActivityFlowDTO[];
  flowResumeEnabled: boolean;
};

export const useEntitiesSync = ({
  completedEntities,
  respondentSubjectId,
  events,
  activityFlows,
  flowResumeEnabled,
}: EntitiesSyncProps) => {
  const { saveGroupProgress, getGroupProgress } = appletModel.hooks.useGroupProgressStateManager();

  // Create ref to exclude from callback dependencies to avoid infinite loop
  const getGroupProgressRef = useRef(getGroupProgress);
  getGroupProgressRef.current = getGroupProgress;

  // Syncs local GroupProgress state with server completions data.
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
        const flow = activityFlows.find((f) => f.id === entity.id);

        if (!flow) {
          console.warn(`[useEntitiesSync] Flow not found for entity ID: ${entity.id}`);
          return;
        }

        // If submitIds match, only skip if local is at or ahead
        const isSameSubmission = groupProgress?.submitId === entity.submitId;

        if (isSameSubmission) {
          // Same submission: Skip if local is completed and as recent or more recent than server
          if ((groupProgress?.endAt ?? 0) >= entity.endTime) {
            return;
          }

          // Same submission: Skip if local is in-progress and at or ahead of server
          if ((groupProgress as FlowProgress)?.pipelineActivityOrder >= pipelineActivityOrder) {
            return;
          }
        }
        // Different submission: Always replace local with server data (continue to save)

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
    [respondentSubjectId, events, activityFlows, saveGroupProgress],
  );

  // Legacy sync logic before flow resume was implemented (#690). Used when flow resume is disabled.
  const syncEntityLegacy = useCallback(
    (entity: CompletedEntityDTO) => {
      const endAtDate = new Date(`${entity.localEndDate}T${entity.localEndTime}`);
      const endAtTimestamp = endAtDate.getTime();

      const entityId = entity.id;
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
    if (flowResumeEnabled) {
      completedEntities?.activities.forEach((entity) => syncEntity(entity, false));
      completedEntities?.activityFlows.forEach((entity) => syncEntity(entity, true));
    } else {
      completedEntities?.activities.forEach(syncEntityLegacy);
      completedEntities?.activityFlows.forEach(syncEntityLegacy);
    }
  }, [
    completedEntities?.activities,
    completedEntities?.activityFlows,
    syncEntity,
    syncEntityLegacy,
  ]);
};
