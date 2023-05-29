export const buildDateFromDto = (dto: string | null | undefined): Date | null => {
  if (!dto) {
    return null
  }
  const result = new Date(`${dto}T00:00`)

  if (result.getFullYear() === 1 || result.getFullYear() === 9999) {
    return null
  }

  return result
}
