import { useCallback, useEffect } from "react"

import { ActivityPipelineType } from "~/abstract/lib"
import { activityModel } from "~/entities/activity"
import { CompletedEntitiesDTO, CompletedEntityDTO } from "~/shared/api"

type FilterCompletedEntitiesProps = {
  appletId: string
  completedEntities: CompletedEntitiesDTO | undefined
}

export const useEntitiesSync = (props: FilterCompletedEntitiesProps) => {
  const { upsertGroupInProgress, groupsInProgress } = activityModel.hooks.useActivityGroupsInProgressState()

  const syncEntity = useCallback(
    (entity: CompletedEntityDTO) => {
      const hoursMinutes = entity.localEndTime.split(":")
      const endAtDate = new Date(entity.localEndDate).setHours(Number(hoursMinutes[0]), Number(hoursMinutes[1]))

      const appletInProgress = groupsInProgress[props.appletId] ?? {}
      const inProgressEntity = appletInProgress[entity.id] ?? {}
      const inProgressEvent = inProgressEntity[entity.scheduledEventId]

      if (!inProgressEvent) {
        return upsertGroupInProgress({
          appletId: props.appletId,
          activityId: entity.id,
          eventId: entity.scheduledEventId,
          progressPayload: {
            type: ActivityPipelineType.Regular,
            startAt: null,
            endAt: new Date(endAtDate).getTime(),
          },
        })
      }

      if (inProgressEvent.endAt) {
        const isServerEndAtBigger = endAtDate > new Date(inProgressEvent.endAt).getTime()

        if (!isServerEndAtBigger) {
          return
        }

        return upsertGroupInProgress({
          appletId: props.appletId,
          activityId: entity.id,
          eventId: entity.scheduledEventId,
          progressPayload: {
            ...inProgressEvent,
            endAt: new Date(endAtDate).getTime(),
          },
        })
      }
    },
    [groupsInProgress, props.appletId, upsertGroupInProgress],
  )

  useEffect(() => {
    if (!props.completedEntities) {
      return
    }

    const completedEntities = [...props.completedEntities.activities, ...props.completedEntities.activityFlows]

    completedEntities.forEach(syncEntity)
  }, [props.completedEntities, syncEntity])
}
