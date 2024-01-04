import { useCallback, useEffect } from "react"

import { ActivityPipelineType } from "~/abstract/lib"
import { appletModel } from "~/entities/applet"
import { CompletedEntitiesDTO, CompletedEntityDTO } from "~/shared/api"

type FilterCompletedEntitiesProps = {
  appletId: string
  completedEntities: CompletedEntitiesDTO | undefined
}

export const useEntitiesSync = (props: FilterCompletedEntitiesProps) => {
  const { upsertGroupInProgress, getGroupInProgressByIds } = appletModel.hooks.useActivityGroupsInProgressState()

  const syncEntity = useCallback(
    (entity: CompletedEntityDTO) => {
      const hoursMinutes = entity.localEndTime.split(":")
      const endAtDate = new Date(entity.localEndDate).setHours(Number(hoursMinutes[0]), Number(hoursMinutes[1]))

      const appletId = props.appletId
      const entityId = entity.id
      const eventId = entity.scheduledEventId

      const eventProgress = getGroupInProgressByIds({
        appletId,
        entityId,
        eventId,
      })

      if (!eventProgress) {
        return upsertGroupInProgress({
          appletId,
          activityId: entityId,
          eventId,
          progressPayload: {
            type: ActivityPipelineType.Regular,
            startAt: null,
            endAt: new Date(endAtDate).getTime(),
          },
        })
      }

      if (eventProgress.endAt) {
        const isServerEndAtBigger = endAtDate > new Date(eventProgress.endAt).getTime()

        if (!isServerEndAtBigger) {
          return
        }

        return upsertGroupInProgress({
          appletId,
          activityId: entityId,
          eventId,
          progressPayload: {
            ...eventProgress,
            endAt: new Date(endAtDate).getTime(),
          },
        })
      }
    },
    [getGroupInProgressByIds, props.appletId, upsertGroupInProgress],
  )

  useEffect(() => {
    if (!props.completedEntities) {
      return
    }

    const completedEntities = [...props.completedEntities.activities, ...props.completedEntities.activityFlows]

    completedEntities.forEach(syncEntity)
  }, [props.completedEntities, syncEntity])
}
