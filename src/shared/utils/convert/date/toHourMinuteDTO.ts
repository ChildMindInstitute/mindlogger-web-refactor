export type HourMinuteDTO = {
  hour: number
  minute: number
}

export const dateToHourMinuteDTO = (date: Date): HourMinuteDTO => {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  }
}
