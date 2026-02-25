import { useCallback, useEffect, useRef, useState } from 'react';

import { v4 as uuidV4 } from 'uuid';

import { ActivityPipelineType, FlowProgress } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { PeriodicityType } from '~/entities/event';
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
  /** When true, skip syncing in-progress data from server (user wants to restart fresh) */
  shouldRestart?: boolean;
};

export const useEntitiesSync = ({
  completedEntities,
  respondentSubjectId,
  events,
  activityFlows,
  flowResumeEnabled,
  shouldRestart,
}: EntitiesSyncProps) => {
  const { saveGroupProgress, getGroupProgress } = appletModel.hooks.useGroupProgressStateManager();
  const { removeActivityProgress } = appletModel.hooks.useActivityProgress();

  // Create ref to exclude from callback dependencies to avoid infinite loop
  const getGroupProgressRef = useRef(getGroupProgress);
  getGroupProgressRef.current = getGroupProgress;

  // Syncs local GroupProgress state with server completions data.
  // Returns true if local GroupProgress state was updated or false if skipped.
  const syncEntity = useCallback(
    (entity: CompletedEntityDTO, isFlow: boolean): boolean => {
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
      // Skip this case when shouldRestart=true (user wants to start fresh, not resume)
      if (isFlow && entity.isFlowCompleted === false) {
        // When restarting, skip in-progress syncing - user wants to start fresh
        if (shouldRestart) {
          return false;
        }

        const flow = activityFlows.find((f) => f.id === entity.id);

        // Prefer activity IDs from the server (matches the version the flow was started at),
        // then fall back to local stored metadata, then current flow version
        const localFlowProgress = groupProgress as FlowProgress | undefined;
        const flowActivityIds =
          entity.flowActivityIds ?? localFlowProgress?.flowActivityIds ?? flow?.activityIds;
        const flowName = flow?.name ?? localFlowProgress?.flowName;

        if (!flowActivityIds) {
          console.info(`[useEntitiesSync] Flow not found and no stored metadata: ${entity.id}`);
          return false;
        }

        if (groupProgress?.submitId === entity.submitId) {
          // If submitIds match, only skip if local is at or ahead
          // ("Keep last activity in each submission" in AnswerService._filter_activity_flows)
          if ((groupProgress as FlowProgress)?.pipelineActivityOrder >= pipelineActivityOrder) {
            return false;
          }
        } else {
          // If submitIds are different, skip if local is in-progress and at or ahead of server
          // AND local was started more recently (meaning local is genuinely newer, not stale)
          // ("Farthest along in-progress flow" in AnswerService._filter_activity_flows)
          if (
            !groupProgress?.endAt &&
            (groupProgress as FlowProgress)?.pipelineActivityOrder >= pipelineActivityOrder &&
            (groupProgress?.startAt ?? 0) > entity.endTime
          ) {
            return false;
          }
          // If submitIds are different, skip if local is completed and as recent or more recent than server
          // ("More recent between best completed flow and best in-progress flow" in AnswerService._filter_activity_flows)
          if ((groupProgress?.endAt ?? 0) >= entity.endTime) {
            return false;
          }
        }

        const nextActivityId = flowActivityIds[pipelineActivityOrder];
        if (!nextActivityId) {
          console.info(`[useEntitiesSync] No next activity found for flow: ${entity.id}`);
          return false;
        }

        // When replacing local progress with a different execution (different submitId),
        // clear stale activity answers from the old execution to prevent them from being
        // shown when the user resumes the new execution.
        if (groupProgress && groupProgress.submitId !== entity.submitId) {
          const activityId = (groupProgress as FlowProgress).currentActivityId;
          if (activityId) {
            removeActivityProgress({
              activityId,
              eventId,
              targetSubjectId,
            });
          }
        }

        saveGroupProgress({
          entityId,
          eventId,
          targetSubjectId,
          progressPayload: {
            type: ActivityPipelineType.Flow,
            currentActivityId: nextActivityId,
            pipelineActivityOrder,
            submitId: entity.submitId,
            appletVersion: entity.version,
            flowActivityIds,
            flowName,
            startAt: groupProgress?.startAt ?? entity.startTime,
            endAt: null,
            context: groupProgress?.context ?? { summaryData: {} },
            event,
          },
        });
        return true;
      }

      // Case 2: Completed entity with no local progress
      // Create a new completed record
      if (!groupProgress) {
        saveGroupProgress({
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
        return true;
      }

      // Case 3: Completed entity with local progress
      // Skip if local is completed and as recent or more recent than server (nothing to update)
      if ((groupProgress.endAt ?? 0) >= entity.endTime) {
        return false;
      }
      // Skip if local is in-progress and started more recently than server completed
      // (but never skip for one-time entities that cannot be restarted after completion)
      const isOneTimeCompletion =
        event?.availability.oneTimeCompletion ||
        event?.availability.periodicityType === PeriodicityType.Once;
      if (
        !groupProgress.endAt &&
        (groupProgress.startAt ?? 0) > entity.endTime &&
        !isOneTimeCompletion
      ) {
        return false;
      }
      // Clear stale activity answers when a completed entity replaces
      // local in-progress state (same or different submitId, flow or standalone).
      // For standalone activities, the entityId is the activityId.
      if (!groupProgress.endAt) {
        const activityId = isFlow ? (groupProgress as FlowProgress).currentActivityId : entityId;
        if (activityId) {
          removeActivityProgress({
            activityId,
            eventId,
            targetSubjectId,
          });
        }
      }

      saveGroupProgress({
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
      return true;
    },
    [respondentSubjectId, events, activityFlows, saveGroupProgress, removeActivityProgress],
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

  const [changes, setChanges] = useState<string[]>([]);

  useEffect(() => {
    if (flowResumeEnabled) {
      const changedIds: string[] = [];
      completedEntities?.activities.forEach((entity) => {
        if (syncEntity(entity, false)) changedIds.push(entity.id);
      });
      completedEntities?.activityFlows.forEach((entity) => {
        if (syncEntity(entity, true)) changedIds.push(entity.id);
      });
      setChanges(changedIds);
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

  return { changes };
};
