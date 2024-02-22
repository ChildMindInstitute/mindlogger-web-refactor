import { format as formatBase, getUnixTime, isEqual } from "date-fns"
import { enGB, fr } from "date-fns/locale"
import i18n from "i18next"

import { MINUTES_IN_HOUR, MS_IN_MINUTE } from "../../constants"
import { DayMonthYear, HourMinute, type Language } from "../types"

const dateFnsLocales = { fr, en: enGB }

export const getMsFromHours = (hours: number): number => {
  return hours * (MINUTES_IN_HOUR * MS_IN_MINUTE)
}

export const getMsFromMinutes = (minutes: number): number => {
  return minutes * MS_IN_MINUTE
}

export const getHourMinute = (dateTime: Date): HourMinute => {
  return {
    hours: dateTime.getHours(),
    minutes: dateTime.getMinutes(),
  }
}

export const format = (date: Date | number, formatStr: string) => {
  // todo - it doesn't work, tried  H or HH
  return formatBase(date, formatStr, {
    locale: dateFnsLocales[i18n.language as Language],
  })
}

export const formatToDtoDate = (date: Date | number) => {
  return formatBase(date, "yyyy-MM-dd")
}

export const formatToDtoTime = (date: Date | number, addSeconds = false) => {
  return formatBase(date, addSeconds ? "HH:mm:ss" : "HH:mm")
}

type TimeOrNoun = {
  formattedDate?: string | null
  translationKey?: string | null
}

export const convertToTimeOnNoun = (date: Date): TimeOrNoun => {
  if (date.getHours() === 12 && date.getMinutes() === 0) {
    return { translationKey: "applet_list_component.noon" }
  } else if (
    (date.getHours() === 23 && date.getMinutes() === 59) ||
    (date.getHours() === 0 && date.getMinutes() === 0)
  ) {
    return { translationKey: "applet_list_component.midnight" }
  } else {
    return {
      formattedDate: date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }
  }
}

export const getDiff = (from: HourMinute, to: HourMinute): number => {
  return (
    getMsFromHours(to.hours) +
    getMsFromMinutes(to.minutes) -
    (getMsFromHours(from.hours) + getMsFromMinutes(from.minutes))
  )
}

type TimeCompareInput = {
  timeSource: HourMinute
  timeTarget: HourMinute
}

export const isSourceLess = ({ timeSource, timeTarget }: TimeCompareInput) => {
  const sourceInMinutes = timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes
  const targetInMinutes = timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes
  return sourceInMinutes < targetInMinutes
}

export const isSourceLessOrEqual = ({ timeSource, timeTarget }: TimeCompareInput) => {
  const sourceInMinutes = timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes
  const targetInMinutes = timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes
  return sourceInMinutes <= targetInMinutes
}

export const isSourceBiggerOrEqual = ({ timeSource, timeTarget }: TimeCompareInput) => {
  const sourceInMinutes = timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes
  const targetInMinutes = timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes
  return sourceInMinutes >= targetInMinutes
}

export const isSourceBigger = ({ timeSource, timeTarget }: TimeCompareInput) => {
  const sourceInMinutes = timeSource.hours * MINUTES_IN_HOUR + timeSource.minutes
  const targetInMinutes = timeTarget.hours * MINUTES_IN_HOUR + timeTarget.minutes
  return sourceInMinutes > targetInMinutes
}

type InIntervalCheckInput = {
  timeToCheck: HourMinute
  intervalFrom: HourMinute
  intervalTo: HourMinute
  including: "from" | "to" | "both" | "none"
}

export const isTimeInInterval = ({ timeToCheck, intervalFrom, intervalTo, including }: InIntervalCheckInput) => {
  if (including === "from") {
    return (
      isSourceBiggerOrEqual({
        timeSource: timeToCheck,
        timeTarget: intervalFrom,
      }) && isSourceLess({ timeSource: timeToCheck, timeTarget: intervalTo })
    )
  } else if (including === "none") {
    return (
      isSourceBigger({ timeSource: timeToCheck, timeTarget: intervalFrom }) &&
      isSourceLess({ timeSource: timeToCheck, timeTarget: intervalTo })
    )
  } else {
    throw new Error("[isTimeInInterval]: Not supported, including = " + including)
  }
}

export const areDatesEqual = (dateLeft: Date, dateRight: Date): boolean =>
  isEqual(dateLeft.setHours(0, 0, 0, 0), dateRight.setHours(0, 0, 0, 0))

export const getUnixTimestamp = (date: Date | number): number => getUnixTime(date)

export const getMidnightDateInMs = (date: Date = new Date()): number => date.setHours(0, 0, 0, 0)

export const convertToDayMonthYear = (date: Date): DayMonthYear => ({
  day: date.getDate(),
  month: date.getMonth() + 1,
  year: date.getFullYear(),
})

export const buildDateTimeFromDto = (yyyymmdd: string, hhmmss: string) => new Date(`${yyyymmdd} ${hhmmss}`)
