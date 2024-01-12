export type HourMinuteDTO = {
  hour: number
  minute: number
}

export const dateToHourMinute = (date: Date): HourMinuteDTO => {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  }
}

export const validateTime = (date: Date): boolean => {
  const hourMinute = dateToHourMinute(date)

  const isHourValid = 0 <= hourMinute.hour && hourMinute.hour < 24
  const isMinuteValid = 0 <= hourMinute.minute && hourMinute.minute < 60

  return isHourValid && isMinuteValid
}
