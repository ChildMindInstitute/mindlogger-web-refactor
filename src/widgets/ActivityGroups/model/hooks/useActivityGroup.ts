import { ActivityListGroup } from "../../lib"
import { createActivityGroupsBuilder } from "../factories/ActivityGroupsBuilder"
import {
  progress as progressMocks,
  allAppletActivities as allActivityMocks,
  eventActivities as eventActivityMocks,
} from "./mocksForEntities"

import { AppletDetails } from "~/entities/applet"
import { EventModel } from "~/entities/event"

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetails
}

export const useActivityGroups = (appletDetails: AppletDetails): UseActivityGroupsReturn => {
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

  eventActivities = eventActivities.filter(x => x.event.scheduledAt)

  const groupAvailable = builder.buildAvailable(eventActivities)
  const groupInProgress = builder.buildInProgress(eventActivities)
  const groupScheduled = builder.buildScheduled(eventActivities)

  return {
    groups: [groupAvailable, groupInProgress, groupScheduled],
    appletDetails,
  }
}
