import { ActivityListGroup } from "../../lib"
import { createActivityGroupsBuilder } from "../factories/ActivityGroupsBuilder"
import {
  progress as progressMocks,
  allAppletActivities as allActivityMocks,
  eventActivities as eventActivityMocks,
} from "./mocksForEntities"

import { activityModel } from "~/entities/activity"
import { EventModel } from "~/entities/event"
import { AppletDetailsDTO, EventsByAppletIdResponseDTO } from "~/shared/api"

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetailsDTO
}

export const useActivityGroups = (
  appletDetails: AppletDetailsDTO,
  eventsDetails: EventsByAppletIdResponseDTO[],
): UseActivityGroupsReturn => {
  const activitiesForBuilder = activityModel.activityBuilder.convertToActivitiesGroupsBuilder(appletDetails.activities)

  const builder = createActivityGroupsBuilder({
    allAppletActivities: activitiesForBuilder,
    appletId: appletDetails.id,
    progress: {}, // progressMocks
  })

  const calculator = EventModel.SheduledDateCalculator

  let eventActivities = EventModel.builder.eventsBuilder.convertToEventsGroupBuilder(
    eventsDetails,
    activitiesForBuilder,
  )

  for (const eventActivity of eventActivities) {
    const date = calculator.calculate(eventActivity.event)
    eventActivity.event.scheduledAt = date
  }

  eventActivities = eventActivities.filter(x => x.event.scheduledAt)

  const groupAvailable = builder.buildAvailable(eventActivities)
  const groupInProgress = builder.buildInProgress(eventActivities)
  const groupScheduled = builder.buildScheduled(eventActivities)

  return {
    groups: [groupAvailable, groupInProgress, groupScheduled],
    appletDetails,
  }
}
