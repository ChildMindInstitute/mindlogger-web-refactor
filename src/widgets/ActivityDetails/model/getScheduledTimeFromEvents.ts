import { AppletEventsResponse } from "~/shared/api"

export const getScheduledTimeFromEvents = (
  eventsRawData: AppletEventsResponse | undefined,
  entityId: string,
): string | null => {
  if (!eventsRawData) {
    return null
  }

  const event = eventsRawData.events.find(event => event.entityId === entityId)

  if (!event) {
    return null
  }

  const startFromHour = event.availability.timeFrom?.hours
  const startFromMinute = event.availability.timeFrom?.minutes

  return startFromHour && startFromMinute ? `${startFromHour}:${startFromMinute}` : null
}
