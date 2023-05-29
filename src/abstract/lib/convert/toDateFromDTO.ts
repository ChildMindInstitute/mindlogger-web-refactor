import { stringToDate } from "~/shared/utils"

export const buildDateFromDto = (dto: string | null | undefined): Date | null => {
  if (!dto) {
    return null
  }
  const result = stringToDate(dto)

  if (result.getFullYear() === 1 || result.getFullYear() === 9999) {
    return null
  }

  return result
}
