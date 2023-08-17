import { ActivityGroupType, ActivityListGroup } from "../lib"

import { CompletedEntitiesDTO } from "~/shared/api"

type FilterCompletedEntitiesProps = {
  groups: ActivityListGroup[]
  completedEntities: CompletedEntitiesDTO | undefined
}

type Return = {
  groups: ActivityListGroup[]
}

export const filterCompletedEntities = (props: FilterCompletedEntitiesProps): Return => {
  if (!props.completedEntities) {
    return {
      groups: props.groups,
    }
  }

  const availableGroup = props.groups.find(group => group.type === ActivityGroupType.Available)
  const scheduledGroup = props.groups.find(group => group.type === ActivityGroupType.Scheduled)
  const inProgressGroup = props.groups.find(group => group.type === ActivityGroupType.InProgress)

  if (!availableGroup || !scheduledGroup || !inProgressGroup) {
    return {
      groups: props.groups,
    }
  }

  const completedActivityIds = props.completedEntities.activities.map(activity => activity.id)
  const completedFlowIds = props.completedEntities.activityFlows.map(flow => flow.id)

  const completedEntityIds = [...completedActivityIds, ...completedFlowIds]

  const filteredAvailableEntities = availableGroup.activities.filter(
    activity => !completedEntityIds.includes(activity.activityId),
  )

  availableGroup.activities = filteredAvailableEntities

  const filteredScheduledEntities = scheduledGroup.activities.filter(
    activity => !completedEntityIds.includes(activity.activityId),
  )

  scheduledGroup.activities = filteredScheduledEntities

  return {
    groups: [availableGroup, scheduledGroup, inProgressGroup],
  }
}
