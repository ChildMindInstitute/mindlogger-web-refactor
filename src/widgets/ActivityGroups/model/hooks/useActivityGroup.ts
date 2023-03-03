import { ActivityListGroup } from "../../lib"
import { createActivityGroupsBuilder } from "../factories/ActivityGroupsBuilder"
import {
  progress as progressMocks,
  allAppletActivities as allActivityMocks,
  eventActivities as eventActivityMocks,
} from "./mocksForEntities"

import { EventModel } from "~/entities/event"
import { AppletDetailsDTO } from "~/shared/api"

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetailsDTO
}

export const useActivityGroups = (appletDetails: AppletDetailsDTO): UseActivityGroupsReturn => {
  const builder = createActivityGroupsBuilder({
    allAppletActivities: allActivityMocks,
    appletId: "apid1",
    progress: progressMocks,
  })

  const calculator = EventModel.SheduledDateCalculator

  let eventActivities = eventActivityMocks

  for (const eventActivity of eventActivities) {
    const date = calculator.calculate(eventActivity.event)
    eventActivity.event.scheduledAt = date
  }

  // Here get only future eventActivities
  eventActivities = eventActivities.filter(x => x.event.scheduledAt)

  const groupAvailable = builder.buildAvailable(eventActivities)
  const groupInProgress = builder.buildInProgress(eventActivities)
  const groupScheduled = builder.buildScheduled(eventActivities)

  return {
    groups: [groupAvailable, groupInProgress, groupScheduled],
    appletDetails,
  }
}
