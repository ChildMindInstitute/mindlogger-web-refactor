import { mapActivitiesFromDto, mapActivityFlowsFromDto } from '../mappers';

import {
  ActivityPipelineType,
  getDataFromProgressId,
  GroupProgressId,
  GroupProgressState,
} from '~/abstract/lib';
import {
  Activity,
  ActivityFlow,
  ActivityListGroup,
  Entity,
  EventEntity,
  createActivityGroupsBuilder,
} from '~/abstract/lib/GroupBuilder';
import { EventModel, ScheduleEvent } from '~/entities/event';
import { mapEventFromDto } from '~/entities/event/model';
import {
  ActivityBaseDTO,
  ActivityFlowDTO,
  AppletEventsResponse,
  HydratedAssignmentDTO,
} from '~/shared/api';

type BuildResult = {
  groups: ActivityListGroup[];
};

type ProcessParams = {
  activities: ActivityBaseDTO[];
  flows: ActivityFlowDTO[];
  assignments: HydratedAssignmentDTO[] | null;
  events: AppletEventsResponse;
  entityProgress: GroupProgressState;
};

const createActivityGroupsBuildManager = () => {
  const buildIdToEntityMap = (
    activities: Activity[],
    activityFlows: ActivityFlow[],
  ): Record<string, Entity> => {
    return [...activities, ...activityFlows].reduce<Record<string, Entity>>((acc, current) => {
      acc[current.id] = current;
      return acc;
    }, {});
  };

  const buildIdToAssignmentsMap = (
    assignments: HydratedAssignmentDTO[],
  ): Record<string, HydratedAssignmentDTO[]> => {
    return assignments.reduce<Record<string, HydratedAssignmentDTO[]>>((acc, current) => {
      const key = current.activityFlowId ?? current.activityId;
      if (acc[key]) {
        acc[key].push(current);
      } else {
        acc[key] = [current];
      }
      return acc;
    }, {});
  };

  const sort = (eventEntities: EventEntity[]) => {
    eventEntities.sort((a: EventEntity, b: EventEntity) => {
      const aIsFlow = a.entity.pipelineType === ActivityPipelineType.Flow;
      const bIsFlow = b.entity.pipelineType === ActivityPipelineType.Flow;

      // Order flows first
      if (aIsFlow && !bIsFlow) {
        return -1;
      } else if (!aIsFlow && bIsFlow) {
        return 1;
      }

      // Then order by entity order
      const orderDiff = a.entity.order - b.entity.order;
      if (orderDiff !== 0) return orderDiff;

      // Then order self-reports first
      if (!a.targetSubject) {
        return -1;
      } else if (!b.targetSubject) {
        return 1;
      }

      // Then order by target subject first name
      const firstNameDiff = a.targetSubject.firstName.localeCompare(b.targetSubject.firstName);
      if (firstNameDiff !== 0) return firstNameDiff;

      // Then order by target subject last name
      return a.targetSubject.lastName.localeCompare(b.targetSubject.lastName);
    });
  };

  const process = (params: ProcessParams): BuildResult => {
    const activities: Activity[] = mapActivitiesFromDto(params.activities);
    const activityFlows: ActivityFlow[] = mapActivityFlowsFromDto(params.flows);

    const eventsResponse = params.events;
    const events: ScheduleEvent[] = EventModel.mapEventsFromDto(eventsResponse.events);

    const idToEntity = buildIdToEntityMap(activities, activityFlows);
    const idToAssignments = params.assignments ? buildIdToAssignmentsMap(params.assignments) : {};

    const builder = createActivityGroupsBuilder({
      allAppletActivities: activities,
      progress: params.entityProgress,
    });

    const calculator = EventModel.ScheduledDateCalculator;

    /* Handle in-progress activities/flows
    =================================================== */
    const groupProgress = params.entityProgress;

    const inProgressEventEntities: EventEntity[] = [];

    // Iterate through currently in-progress activity/flow data and use events attached to
    // their persisted state to build groupInProgress
    for (const [groupProgressId, groupProgressItem] of Object.entries(groupProgress)) {
      const { entityId, targetSubjectId } = getDataFromProgressId(
        groupProgressId as GroupProgressId,
      );

      // Event should always be present in groupProgressItem, but we must check for type safety
      if (!groupProgressItem.event) continue;

      const event = mapEventFromDto(groupProgressItem.event);

      const entity = idToEntity[entityId];
      if (!entity || entity.isHidden) continue;

      const targetSubject = targetSubjectId
        ? (params.assignments?.find((a) => a.targetSubject.id === targetSubjectId)?.targetSubject ??
          null)
        : null;

      inProgressEventEntities.push({
        entity,
        event,
        targetSubject,
      });
    }

    sort(inProgressEventEntities);

    const groupInProgress = builder.buildInProgress(inProgressEventEntities);

    /* Handle available/scheduled activities/flows
    =================================================== */
    const eventEntities: EventEntity[] = [];

    for (const event of events) {
      const entity = idToEntity[event.entityId];
      if (!entity || entity.isHidden) continue;

      event.scheduledAt = calculator.calculate(event);
      if (!event.scheduledAt) continue;

      if (params.assignments) {
        const assignments = idToAssignments[entity.id] ?? [];

        // Add auto-assignment if enabled for this activity/flow
        if (entity.autoAssign) {
          eventEntities.push({ entity, event, targetSubject: null });
        }

        // Add any additional assignments (without duplicating possible auto-assignment)
        for (const { respondentSubject, targetSubject } of assignments) {
          const isSelfAssign = respondentSubject.id === targetSubject.id;
          if (entity.autoAssign && isSelfAssign) continue;

          eventEntities.push({
            entity,
            event,
            targetSubject: isSelfAssign ? null : targetSubject,
          });
        }
      } else {
        // Assignments disabled
        eventEntities.push({
          entity,
          event,
          targetSubject: null,
        });
      }
    }

    sort(eventEntities);

    const groupAvailable = builder.buildAvailable(eventEntities);
    const groupScheduled = builder.buildScheduled(eventEntities);

    return {
      groups: [groupInProgress, groupAvailable, groupScheduled],
    };
  };

  return {
    process,
  };
};

export const ActivityGroupsBuildManager = createActivityGroupsBuildManager();
