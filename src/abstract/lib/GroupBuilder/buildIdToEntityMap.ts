import { Activity, ActivityFlow, Entity } from "."

export const buildIdToEntityMap = (activities: Activity[], activityFlows?: ActivityFlow[]): Record<string, Entity> => {
  return [...activities, ...(activityFlows ?? [])].reduce<Record<string, Entity>>((acc, current) => {
    acc[current.id] = current
    return acc
  }, {})
}
