export type DayMonthYearDTO = {
  day: number
  month: number
  year: number
}

export const dateToDayMonthYear = (date: Date): DayMonthYearDTO => {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }
}

export const validateDate = (date: Date): boolean => {
  const dayMonthYear = dateToDayMonthYear(date)

  const isDayValid = 0 < dayMonthYear.day && dayMonthYear.day < 32
  const isMonthValid = 0 < dayMonthYear.month && dayMonthYear.month < 13
  const isYearValid = 1901 < dayMonthYear.year && dayMonthYear.year < 2099

  return isDayValid && isMonthValid && isYearValid
}
