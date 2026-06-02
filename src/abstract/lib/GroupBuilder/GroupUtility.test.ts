import { GroupUtility } from './GroupUtility';

import { ScheduleEvent } from '~/entities/event';

const groupUtility = new GroupUtility({
  allAppletActivities: [],
  progress: {},
});

const createEvent = (startTime: { hours: number; minutes: number } = { hours: 0, minutes: 0 }) =>
  ({
    availability: {
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-01-02'),
      timeFrom: startTime,
      timeTo: { hours: 23, minutes: 59 },
    },
  }) as ScheduleEvent;

describe('isInsideValidDatesInterval', () => {
  it('should return true when the event is between the start date-time and end date-time', () => {
    const event = createEvent();

    vi.spyOn(groupUtility, 'getNow').mockReturnValue(new Date('2021-01-01T00:00:00'));
    const result = groupUtility.isInsideAvailabilityDatesInterval(event, false);
    expect(result).toBe(true);
  });

  it('should return true when the event is on the end date but before the time to', () => {
    const event = {
      availability: {
        startDate: new Date('2021-01-01'),
        endDate: new Date('2021-01-02'),
        timeFrom: { hours: 0, minutes: 0 },
        timeTo: { hours: 23, minutes: 59 },
      },
    } as ScheduleEvent;

    vi.spyOn(groupUtility, 'getNow').mockReturnValue(new Date('2021-01-02T12:00:00'));
    const result = groupUtility.isInsideAvailabilityDatesInterval(event, false);
    expect(result).toBe(true);
  });

  it('should return false when the event is before the start date-time and the event can not be accessed before the time from', () => {
    const event = createEvent();

    vi.spyOn(groupUtility, 'getNow').mockReturnValue(new Date('2020-12-31T00:00:00'));
    const result = groupUtility.isInsideAvailabilityDatesInterval(event, false);
    expect(result).toBe(false);
  });

  it('should return true when the current time is before the start date-time and the event can be accessed before the time from', () => {
    const event = createEvent();

    vi.spyOn(groupUtility, 'getNow').mockReturnValue(new Date('2021-01-01T00:00:00'));
    const result = groupUtility.isInsideAvailabilityDatesInterval(event, true);
    expect(result).toBe(true);
  });

  it('should return false when the event is after the end date-time', () => {
    const event = createEvent({ hours: 12, minutes: 0 });

    vi.spyOn(groupUtility, 'getNow').mockReturnValue(new Date('2021-01-03T00:00:00'));
    const result = groupUtility.isInsideAvailabilityDatesInterval(event, false);
    expect(result).toBe(false);
  });
});
