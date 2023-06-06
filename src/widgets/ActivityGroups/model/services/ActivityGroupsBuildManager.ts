import { ActivityListGroup, EventEntity } from "../../lib"
import { createActivityGroupsBuilder } from "../factories/ActivityGroupsBuilder"
import { mapActivitiesFromDto } from "../mappers"

import { Activity, ActivityFlow, ActivityPipelineType, Entity, activityModel } from "~/entities/activity"
import { EventModel, ScheduleEvent } from "~/entities/event"
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"

type BuildResult = {
  groups: ActivityListGroup[]
}

type ProcessParams = {
  appletDetails: AppletDetailsDTO
  eventsDetails: AppletEventsResponse
  entityProgress: activityModel.types.GroupsProgressState
}

const createActivityGroupsBuildManager = () => {
  const buildIdToEntityMap = (activities: Activity[], activityFlows: ActivityFlow[]): Record<string, Entity> => {
    return [...activities, ...activityFlows].reduce<Record<string, Entity>>((acc, current) => {
      acc[current.id] = current
      return acc
    }, {})
  }

  const sort = (eventEntities: EventEntity[]) => {
    let flows = eventEntities.filter(x => x.entity.pipelineType === ActivityPipelineType.Flow)
    let activities = eventEntities.filter(x => x.entity.pipelineType === ActivityPipelineType.Regular)

    flows = flows.sort((a, b) => a.entity.order - b.entity.order)
    activities = activities.sort((a, b) => a.entity.order - b.entity.order)

    return [...flows, ...activities]
  }

  const process = (params: ProcessParams): BuildResult => {
    const appletResponse = params.appletDetails

    const activities: Activity[] = mapActivitiesFromDto(appletResponse.activities)

    const activityFlows: ActivityFlow[] = [] // Hardcoded empty array because Web app not support activity flows

    const eventsResponse = params.eventsDetails

    const events: ScheduleEvent[] = EventModel.mapEventsFromDto(eventsResponse.events)

    const idToEntity = buildIdToEntityMap(activities, activityFlows)

    const builder = createActivityGroupsBuilder({
      allAppletActivities: activities,
      appletId: appletResponse.id,
      progress: params.entityProgress,
    })

    let entityEvents = events
      .map<EventEntity>(event => ({
        entity: idToEntity[event.entityId],
        event,
      }))
      // @todo - remove after fix on BE
      .filter(entityEvent => !!entityEvent.entity)

    const calculator = EventModel.ScheduledDateCalculator

    for (const eventActivity of entityEvents) {
      const date = calculator.calculate(eventActivity.event)
      eventActivity.event.scheduledAt = date
    }

    entityEvents = entityEvents.filter(x => x.event.scheduledAt)

    entityEvents = entityEvents.filter(x => !x.entity.isHidden)

    entityEvents = sort(entityEvents)

    const groupAvailable = builder.buildAvailable(entityEvents)
    const groupInProgress = builder.buildInProgress(entityEvents)
    const groupScheduled = builder.buildScheduled(entityEvents)

    return {
      groups: [groupInProgress, groupAvailable, groupScheduled],
    }
  }

  return {
    process,
  }
}

export default createActivityGroupsBuildManager()
