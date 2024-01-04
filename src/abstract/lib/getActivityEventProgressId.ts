export const getProgressId = (entityId: string, eventId: string): string => {
  return `${entityId}/${eventId}`
}
