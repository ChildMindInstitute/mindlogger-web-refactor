import { ActivityPipelineType, activityModel } from "~/entities/activity"
import { CompletedEntitiesDTO } from "~/shared/api"

type FilterCompletedEntitiesProps = {
  appletId: string
  completedEntities: CompletedEntitiesDTO | undefined
}

export const useEntitiesSync = (props: FilterCompletedEntitiesProps) => {
  if (!props.completedEntities) {
    return
  }

  const { upsertGroupInProgress } = activityModel.hooks.useActivityGroupsInProgressState()

  const completedEntities = [...props.completedEntities.activities, ...props.completedEntities.activityFlows]

  const { groupsInProgress } = activityModel.hooks.useActivityGroupsInProgressState()

  completedEntities.forEach(entity => {
    const hoursMinutes = entity.localEndTime.split(":")
    const endAtDate = new Date(entity.localEndDate).setHours(Number(hoursMinutes[0]), Number(hoursMinutes[1]))

    const appletInProgress = groupsInProgress[props.appletId] ?? {}
    const inProgressEntity = appletInProgress[entity.id] ?? {}
    const inProgressEvent = inProgressEntity[entity.scheduledEventId]

    if (!inProgressEvent) {
      upsertGroupInProgress({
        appletId: props.appletId,
        activityId: entity.id,
        eventId: entity.scheduledEventId,
        progressPayload: {
          type: ActivityPipelineType.Regular,
          startAt: null,
          endAt: new Date(endAtDate),
        },
      })
    }

    if (inProgressEvent.endAt) {
      const isServerEndAtBigger = endAtDate > new Date(inProgressEvent.endAt).getTime()

      if (isServerEndAtBigger) {
        upsertGroupInProgress({
          appletId: props.appletId,
          activityId: entity.id,
          eventId: entity.scheduledEventId,
          progressPayload: {
            ...inProgressEvent,
            endAt: new Date(endAtDate),
          },
        })
      }
    }
  })
}
