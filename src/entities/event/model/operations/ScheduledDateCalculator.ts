import { differenceInMonths, isEqual, startOfDay, subMonths } from "date-fns"
import { Parse, Day } from "dayspan"

import { EventAvailability, AvailabilityType, ScheduleEvent, PeriodicityType } from "~/shared/lib"

type EventParseInput = Parameters<typeof Parse.schedule>[0]

const setTime = (target: Date, availability: EventAvailability) => {
  if (availability.timeFrom) {
    target.setHours(availability.timeFrom.hours)
    target.setMinutes(availability.timeFrom.minutes)
  }
}

const isTodayDate = (date: Date): boolean => {
  return startOfDay(date) === startOfDay(new Date())
}

const calculateForMonthly = (selectedDate: Date, availability: EventAvailability): Date | null => {
  const today = startOfDay(new Date())

  let date = new Date(selectedDate)

  const diff = differenceInMonths(date, today)
  const check = subMonths(date, diff)

  if (check > today) {
    date = subMonths(date, diff + 1)
  } else {
    date = check
  }
  if (date < availability.startDate! || date > availability.endDate!) {
    return null
  }
  setTime(date, availability)

  return date
}

const calculateForSpecificDay = (specificDay: Date, availability: EventAvailability): Date | null => {
  const isAlwaysAvailable = availability.availabilityType === AvailabilityType.AlwaysAvailable

  if (!isAlwaysAvailable && !isTodayDate(specificDay)) {
    return null
  }

  const selectedYear = specificDay.getFullYear()
  const selectedMonth = specificDay.getMonth()
  const selectedDay = specificDay.getDate()

  const result = new Date(selectedYear, selectedMonth, selectedDay)
  setTime(result, availability)
  return result
}

const calculateScheduledAt = (event: ScheduleEvent): Date | null => {
  const { availability, selectedDate } = event

  const now = new Date()

  if (selectedDate && !isEqual(selectedDate, startOfDay(selectedDate))) {
    throw new Error("[SheduledDateCalculator]: selectedDate contains time set")
  }

  const alwaysAvailable = availability.availabilityType === AvailabilityType.AlwaysAvailable

  const scheduled = availability.availabilityType === AvailabilityType.ScheduledAccess

  if (alwaysAvailable || (scheduled && availability.periodicityType === PeriodicityType.Once)) {
    return calculateForSpecificDay(alwaysAvailable ? now : selectedDate!, availability)
  }

  if (availability.periodicityType === PeriodicityType.Monthly) {
    return calculateForMonthly(selectedDate!, availability)
  }

  const parseInput: EventParseInput = {}

  if (availability.periodicityType === PeriodicityType.Weekly) {
    const dayOfWeek = selectedDate!.getDay()
    parseInput.dayOfWeek = [dayOfWeek]
  } else if (availability.periodicityType === PeriodicityType.Weekdays) {
    parseInput.dayOfWeek = [1, 2, 3, 4, 5]
  }

  if (availability.startDate) {
    parseInput.start = availability.startDate.getTime()
  }
  if (availability.endDate) {
    parseInput.end = availability.endDate.getTime()
  }

  if (availability.timeFrom) {
    parseInput.times = [
      availability.timeFrom.minutes === 0
        ? `${availability.timeFrom.hours}`
        : `${availability.timeFrom.hours}:${availability.timeFrom.minutes}`,
    ]
  }

  const parsedSchedule = Parse.schedule(parseInput)

  const fromDate = Day.fromDate(now) as Day

  const futureSchedule = parsedSchedule.forecast(fromDate, true, 1, 0, true)

  const result = futureSchedule.first()

  if (!result) {
    return null
  }

  return result[0].start.date
}

const cache = new Map()

export const SheduledDateCalculator = {
  calculate: (event: ScheduleEvent): Date | null => {
    const today = new Date().toDateString()

    const key = event.id + JSON.stringify(event.availability) + (event.selectedDate?.getTime() ?? "") + today

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = calculateScheduledAt(event)
    cache.set(key, result)

    return result
  },
}
