import { mapActivitiesFromDto, mapActivityFlowsFromDto } from '../mappers';

import { ActivityPipelineType, GroupProgressState } from '~/abstract/lib';
import {
  Activity,
  ActivityFlow,
  ActivityListGroup,
  Entity,
  EventEntity,
  createActivityGroupsBuilder,
} from '~/abstract/lib/GroupBuilder';
import { EventModel, ScheduleEvent } from '~/entities/event';
import { ActivityBaseDTO, ActivityFlowDTO, AppletEventsResponse } from '~/shared/api';

type BuildResult = {
  groups: ActivityListGroup[];
};

type ProcessParams = {
  activities: ActivityBaseDTO[];
  flows: ActivityFlowDTO[];
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

  const sort = (eventEntities: EventEntity[]) => {
    let flows = eventEntities.filter((x) => x.entity.pipelineType === ActivityPipelineType.Flow);
    let activities = eventEntities.filter(
      (x) => x.entity.pipelineType === ActivityPipelineType.Regular,
    );

    flows = flows.sort((a, b) => a.entity.order - b.entity.order);
    activities = activities.sort((a, b) => a.entity.order - b.entity.order);

    return [...flows, ...activities];
  };

  const process = (params: ProcessParams): BuildResult => {
    const activities: Activity[] = mapActivitiesFromDto(params.activities);
    const activityFlows: ActivityFlow[] = mapActivityFlowsFromDto(params.flows);

    const eventsResponse = params.events;
    const events: ScheduleEvent[] = EventModel.mapEventsFromDto(eventsResponse.events);

    const idToEntity = buildIdToEntityMap(activities, activityFlows);

    const builder = createActivityGroupsBuilder({
      allAppletActivities: activities,
      progress: params.entityProgress,
    });

    let eventEntities: EventEntity[] = [];
    const calculator = EventModel.ScheduledDateCalculator;

    for (const event of events) {
      const entity = idToEntity[event.entityId];
      if (!entity || entity.isHidden) continue;

      event.scheduledAt = calculator.calculate(event);
      if (!event.scheduledAt) continue;

      const eventEntity: EventEntity = {
        entity,
        event,
      };

      eventEntities.push(eventEntity);
    }

    eventEntities = sort(eventEntities);

    const groupAvailable = builder.buildAvailable(eventEntities);
    const groupInProgress = builder.buildInProgress(eventEntities);
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
