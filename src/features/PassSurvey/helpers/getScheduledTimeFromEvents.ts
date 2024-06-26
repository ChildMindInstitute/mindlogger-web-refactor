import { getUnixTime } from 'date-fns';

import { ScheduleEventDto } from '~/shared/api';

export const getScheduledTimeFromEvents = (event: ScheduleEventDto): number | null => {
  const startFromDate = event.availability.startDate;
  const startFromHour = event.availability.timeFrom?.hours;
  const startFromMinute = event.availability.timeFrom?.minutes;
  if (!startFromDate || !startFromHour || !startFromMinute) {
    return null;
  }

  const startFrom = new Date(startFromDate).setHours(startFromHour, startFromMinute, 0, 0);

  return startFromHour && startFromMinute ? getUnixTime(startFrom) : null;
};
