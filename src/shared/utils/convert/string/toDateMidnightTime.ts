export const stringToDateMidnightTime = (stringDate: string): Date => {
  return new Date(`${stringDate}T00:00`)
}
