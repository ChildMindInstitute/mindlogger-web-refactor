import { useMemo } from "react"

import { ActivityListGroup } from "../../lib"
import { createActivityGroupsBuilder } from "../factories/ActivityGroupsBuilder"

import { activityModel } from "~/entities/activity"
import { EventModel } from "~/entities/event"
import { AppletDetailsDTO, EventsByAppletIdResponseDTO } from "~/shared/api"

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetailsDTO
}

export const useActivityGroups = (
  appletDetails: AppletDetailsDTO,
  eventsDetails: EventsByAppletIdResponseDTO,
): UseActivityGroupsReturn => {
  const { groupsInProgress } = activityModel.hooks.useActivityGroupsInProgressState()

  const activitiesForBuilder = useMemo(() => {
    return activityModel.activityBuilder.convertToActivitiesGroupsBuilder(appletDetails.activities)
  }, [appletDetails.activities])

  const builder = useMemo(() => {
    return createActivityGroupsBuilder({
      allAppletActivities: activitiesForBuilder,
      appletId: appletDetails.id,
      progress: groupsInProgress,
    })
  }, [activitiesForBuilder, appletDetails.id, groupsInProgress])

  const calculator = useMemo(() => EventModel.SheduledDateCalculator, [])

  const eventActivities = useMemo(() => {
    return EventModel.builder.eventsBuilder.convertToEventsGroupBuilder(eventsDetails, activitiesForBuilder)
  }, [eventsDetails, activitiesForBuilder])

  const eventActivityCalculatedScheduleAt = useMemo(() => {
    return eventActivities.map(eventActivity => {
      const date = calculator.calculate(eventActivity.event)

      return { ...eventActivity, event: { ...eventActivity.event, scheduledAt: date } }
    })
  }, [eventActivities, calculator])

  const filteredEventActivities = useMemo(() => {
    return eventActivityCalculatedScheduleAt.filter(x => x.activity).filter(x => x.event.scheduledAt)
  }, [eventActivityCalculatedScheduleAt])

  const groupAvailable = useMemo(() => {
    return builder.buildAvailable(filteredEventActivities)
  }, [builder, filteredEventActivities])
  const groupInProgress = useMemo(() => {
    return builder.buildInProgress(filteredEventActivities)
  }, [builder, filteredEventActivities])
  const groupScheduled = useMemo(() => {
    return builder.buildScheduled(filteredEventActivities)
  }, [builder, filteredEventActivities])

  const generatedGroups = useMemo(() => {
    return [groupInProgress, groupAvailable, groupScheduled]
  }, [groupAvailable, groupInProgress, groupScheduled])

  return {
    groups: generatedGroups,
    appletDetails,
  }
}
