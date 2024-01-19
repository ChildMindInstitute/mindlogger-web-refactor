import { addDays, addMinutes, subDays, subMinutes } from "date-fns"

import { GroupsBuildContext } from "./GroupUtility"
import { ScheduledGroupEvaluator } from "./ScheduledGroupEvaluator"
import { EventEntity, Entity } from "../../lib"

import { ActivityPipelineType, GroupProgressState } from "~/abstract/lib"
import { AvailabilityLabelType, EventAvailability, PeriodicityType } from "~/entities/event"
import { HourMinute } from "~/shared/utils"
import { ActivityType } from "~/widgets/ActivityGroups/lib"

jest.mock("@app/shared/lib/constants", () => ({
  ...jest.requireActual("@app/shared/lib/constants"),
  STORE_ENCRYPTION_KEY: "12345",
}))

const getProgress = (startAt: Date, endAt: Date | null) => {
  const result: GroupProgressState = {
    "test-entity-id-1/test-event-id-1": {
      type: ActivityPipelineType.Regular,
      startAt: startAt.getTime(),
      endAt: endAt ? endAt.getTime() : null,
    },
  }
  return result
}

const getEmptyProgress = () => {
  const result: GroupProgressState = {}
  return result
}

const getActivity = (): Entity => {
  const result: Entity = {
    description: "test-description-1",
    id: "test-entity-id-1",
    name: "test-entity-name-1",
    pipelineType: ActivityPipelineType.Regular,
    isHidden: false,
    order: 0,
    type: ActivityType.NotDefined,
    containsResponseTypes: [],
    image: null,
  }
  return result
}

const TimeFrom = { hours: 12, minutes: 30 }

const TimeTo: HourMinute = { hours: 10, minutes: 15 }

const getScheduledSection = (): EventAvailability => {
  const result: EventAvailability = {
    availabilityType: AvailabilityLabelType.ScheduledAccess,
    oneTimeCompletion: false,
    periodicityType: PeriodicityType.Daily,
    allowAccessBeforeFromTime: false,
    endDate: null,
    startDate: null,
    timeFrom: TimeFrom,
    timeTo: TimeTo,
  }
  return result
}

const getScheduledEventEntity = (settings: { startDate: Date; endDate: Date; scheduledAtDay: Date }): EventEntity => {
  const { startDate, endDate, scheduledAtDay } = settings

  const section = getScheduledSection()

  const scheduledAt = new Date(scheduledAtDay)
  scheduledAt.setHours(section.timeFrom!.hours)
  scheduledAt.setMinutes(section.timeFrom!.minutes)

  const result: EventEntity = {
    entity: getActivity(),
    event: {
      availability: {
        ...section,
        startDate,
        endDate,
      },
      entityId: "test-id-1",
      id: "test-event-id-1",
      notificationSettings: {
        notifications: [],
      },
      scheduledAt,
      selectedDate: null,
      timers: {
        idleTimer: null,
        timer: null,
      },
    },
  }

  return result
}

const mockGetNow = (evaluator: ScheduledGroupEvaluator, mockedNowDate: Date) => {
  //@ts-expect-error - private method
  evaluator.utility.getNow = jest.fn(() => new Date(mockedNowDate))
}

const buildDateTime = (startAt: Date, time: HourMinute): Date => {
  const result = new Date(startAt)
  result.setHours(time.hours)
  result.setMinutes(time.minutes)
  return result
}

const getFridayInSeptember = () => new Date(2023, 8, 1)

describe("ScheduledGroupEvaluator cross-day tests", () => {
  describe("Should return item when now is 1 minute earlier than TimeFrom", () => {
    const startAt = getFridayInSeptember()

    const progress: GroupProgressState = getEmptyProgress()

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: "test-applet-id-1",
    }

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    })

    const evaluator = new ScheduledGroupEvaluator(input)

    let now = buildDateTime(startAt, TimeFrom)
    now = subMinutes(now, 1)
    mockGetNow(evaluator, now)

    it("Test Once", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Daily", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Weekly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Monthly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Weekdays", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })
  })

  describe("Should not return item when now is 1 minute earlier than TimeFrom and is completed 5 minutes earlier", () => {
    const startAt = getFridayInSeptember()

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    })

    let now = buildDateTime(startAt, TimeFrom)

    const progress: GroupProgressState = getProgress(subMinutes(now, 10), subMinutes(now, 5))

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: "test-applet-id-1",
    }

    const evaluator = new ScheduledGroupEvaluator(input)

    now = subMinutes(now, 1)
    mockGetNow(evaluator, now)

    it("Test Once", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Daily", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Weekly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Monthly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Weekdays", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })
  })

  describe("Should not return item when now is 1 minute later than TimeFrom", () => {
    const startAt = getFridayInSeptember()

    const progress: GroupProgressState = getEmptyProgress()

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: "test-applet-id-1",
    }

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    })

    const evaluator = new ScheduledGroupEvaluator(input)

    let now = buildDateTime(startAt, TimeFrom)
    now = addMinutes(now, 1)
    mockGetNow(evaluator, now)

    it("Test Once", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Daily", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Weekly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Monthly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Weekdays", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })
  })

  describe("Should return item when Daily and now is 1 minute later than TimeTo", () => {
    const startAt = getFridayInSeptember()

    const progress: GroupProgressState = getEmptyProgress()

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: "test-applet-id-1",
    }

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    })

    const evaluator = new ScheduledGroupEvaluator(input)

    let now = buildDateTime(startAt, TimeTo)
    now = addMinutes(now, 1)
    mockGetNow(evaluator, now)

    it("Test Once", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Daily", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Weekly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Monthly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Weekdays", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })
  })

  describe("Should return item when Weekly, Monthly, Once and now is 1 minute earlier than TimeTo and today is Fri", () => {
    const startAt = getFridayInSeptember()

    const progress: GroupProgressState = getEmptyProgress()

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: "test-applet-id-1",
    }

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    })

    const evaluator = new ScheduledGroupEvaluator(input)

    let now = buildDateTime(startAt, TimeTo)
    now = subMinutes(now, 1)
    mockGetNow(evaluator, now)

    it("Test todays is Friday", () => {
      expect(startAt.getDay()).toEqual(5)
    })

    it("Test Once", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Once
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Weekly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })

    it("Test Monthly", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Monthly
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })
  })

  describe("Should not return item when Daily, Weekdays and now is 1 minute earlier than TimeTo and today is Fri", () => {
    const startAt = getFridayInSeptember()

    const progress: GroupProgressState = getEmptyProgress()

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: "test-applet-id-1",
    }

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    })

    const evaluator = new ScheduledGroupEvaluator(input)

    let now = buildDateTime(startAt, TimeTo)
    now = subMinutes(now, 1)
    mockGetNow(evaluator, now)

    it("Test todays is Friday", () => {
      expect(startAt.getDay()).toEqual(5)
    })

    it("Test Daily", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Daily
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })

    it("Test Weekdays", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([])
    })
  })

  describe("Should return item when Weekdays and now is 1 minute earlier than TimeTo and today is Mon", () => {
    let startAt = getFridayInSeptember()
    startAt = subDays(startAt, 4)

    const progress: GroupProgressState = getEmptyProgress()

    const input: GroupsBuildContext = {
      allAppletActivities: [],
      progress,
      appletId: "test-applet-id-1",
    }

    const eventEntity: EventEntity = getScheduledEventEntity({
      scheduledAtDay: startAt,
      startDate: subDays(startAt, 2),
      endDate: addDays(startAt, 2),
    })

    const evaluator = new ScheduledGroupEvaluator(input)

    let now = buildDateTime(startAt, TimeTo)
    now = subMinutes(now, 1)
    mockGetNow(evaluator, now)

    it("Test todays is Monday", () => {
      expect(startAt.getDay()).toEqual(1)
    })

    it("Test Weekdays", () => {
      eventEntity.event.availability.periodicityType = PeriodicityType.Weekdays
      const result = evaluator.evaluate([eventEntity])
      expect(result).toEqual([eventEntity])
    })
  })
})
