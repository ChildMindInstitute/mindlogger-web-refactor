import { useAppletByIdQuery } from "../../api"
import { ActivityListGroup } from "../../lib"
import { createActivityGroupsBuilder } from "../factories/ActivityGroupsBuilder"
import {
  progress as progressMocks,
  allAppletActivities as allActivityMocks,
  eventActivities as eventActivityMocks,
} from "./mocksForEntities"

import { EventModel } from "~/entities/event"
import { AppletDetailsDto } from "~/shared/api"

type UseActivityGroupsReturn = {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error?: ReturnType<typeof useAppletByIdQuery>["error"]
  groups: ActivityListGroup[]
  appletDetails: AppletDetailsDto
}

export const useActivityGroups = (appletId: string): UseActivityGroupsReturn => {
  const { data } = useAppletByIdQuery(appletId)

  const appletDetails = data?.data?.result as AppletDetailsDto

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
    isSuccess: true,
    isLoading: false,
    isError: false,
    error: null,
    appletDetails,
  }
}
