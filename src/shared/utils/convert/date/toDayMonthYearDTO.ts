export type DayMonthYearDTO = {
  day: number
  month: number
  year: number
}

export const dateToDayMonthYearDTO = (date: Date): DayMonthYearDTO => {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }
}
