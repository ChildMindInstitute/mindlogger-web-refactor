import { getUnixTime } from "date-fns"

import { AppletEventsResponse } from "~/shared/api"

export const getScheduledTimeFromEvents = (
  eventsRawData: AppletEventsResponse | undefined,
  entityId: string,
): number | null => {
  if (!eventsRawData) {
    return null
  }

  const event = eventsRawData.events.find(event => event.entityId === entityId)

  if (!event) {
    return null
  }

  const startFromDate = event.availability.startDate
  const startFromHour = event.availability.timeFrom?.hours
  const startFromMinute = event.availability.timeFrom?.minutes
  if (!startFromDate || !startFromHour || !startFromMinute) {
    return null
  }

  const startFrom = new Date(startFromDate).setHours(startFromHour, startFromMinute, 0, 0)

  return startFromHour && startFromMinute ? getUnixTime(startFrom) : null
}
