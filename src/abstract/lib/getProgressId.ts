export const getProgressId = (entityId: string, eventId: string): string => {
  return `${entityId}/${eventId}`
}

export const getDataFromProgressId = (progressId: string): { entityId: string; eventId: string } => {
  const [entityId, eventId] = progressId.split("/")

  return { entityId, eventId }
}
