export const getActivityEventProgressId = (activityId: string, eventId: string): string => {
  return `${activityId}/${eventId}`
}
