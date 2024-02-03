import { useCallback, useEffect, useMemo } from "react"

import { useLocation } from "react-router-dom"

import { getDataFromProgressId } from "~/abstract/lib"
import { EventEntity, buildIdToEntityMap } from "~/abstract/lib/GroupBuilder"
import { AvailableGroupEvaluator } from "~/abstract/lib/GroupBuilder/AvailableGroupEvaluator"
import { GroupsBuildContext } from "~/abstract/lib/GroupBuilder/GroupUtility"
import { appletModel } from "~/entities/applet"
import { useUserEventsMutation } from "~/entities/event"
import { ROUTES } from "~/shared/constants"
import { matchPaths } from "~/shared/utils"
import { useAppSelector } from "~/shared/utils"
import { mapActivitiesFromDto } from "~/widgets/ActivityGroups/model/mappers"

const AVAILABLE_PATHS = [ROUTES.profile.path, ROUTES.settings.path, ROUTES.appletList.path]

export const useEntityProgressAutoCompletion = () => {
  const location = useLocation()

  const { mutateAsync: getUserEvents } = useUserEventsMutation()

  const applets = useAppSelector(appletModel.selectors.appletsSelector)

  const progressKeys = useMemo(() => Object.keys(applets.groupProgress), [applets.groupProgress])

  const isProgressEmpty = progressKeys.length === 0

  const isValidPath = matchPaths(AVAILABLE_PATHS, location.pathname).some(Boolean)

  const performAutoCompletion = useCallback(() => {
    // Here logic for auto completion

    // Step 1: Get all events from request
    // const userEventsData = await getUserEvents(undefined) // I don't know about this request, I think it is not a good idea [Just example]
    // const userEvents = userEventsData.data?.result

    // Step 2: Get all progress entities ids from redux
    const progressEntityEvents = progressKeys.map((progressId: string) => {
      return getDataFromProgressId(progressId)
    })

    console.info(progressEntityEvents)

    // Step 3: Get all activities by progress entities ids from requrest

    // Step 4: Map all activitiesDTOS into activities
    const activities = mapActivitiesFromDto([]) // Provide ActivityDTO here

    const idToEntity = buildIdToEntityMap(activities)
    console.info(idToEntity)

    // Step 5: Prepare input params for AvailableGroupEvaluator
    const inputParams: GroupsBuildContext = {
      progress: applets.groupProgress,
      allAppletActivities: activities,
    }

    // Step 6: Create AvailableGroupEvaluator instance
    const availableEvaluator = new AvailableGroupEvaluator(inputParams)

    // Step 7: Prepate eventsEntities from userEvents and progressEntityEvents
    // const events = userEvents?.reduce<Array<ScheduleEventDto>>((acc, ue) => acc.concat(ue.events), [])
    // console.info(events)

    // This example of how to map events to EventEntity taken from src/widgets/ActivityGroups/model/services/ActivityGroupsBuildManager.ts
    const eventsEntities: Array<EventEntity> = []
    // const eventsEntities: Array<EventEntity> = events
    //   .map<EventEntity>(event => ({
    //     entity: idToEntity[event.entityId],
    //     event,
    //   }))
    //   // @todo - remove after fix on BE
    //   .filter(entityEvent => !!entityEvent.entity)

    // Step 8: Evaluate available events
    const filtered = availableEvaluator.evaluate(eventsEntities)
    console.info(filtered)

    // Step 9: Take events which are already unavailable

    // Step 10: Get actual activity progress from the redux "progress"

    // Step 11: Process answers
    // Step 12: Submit answers
  }, [applets.groupProgress, getUserEvents, progressKeys])

  useEffect(() => {
    if (isValidPath && !isProgressEmpty) {
      performAutoCompletion()
    }
  }, [isProgressEmpty, isValidPath, performAutoCompletion])
}
