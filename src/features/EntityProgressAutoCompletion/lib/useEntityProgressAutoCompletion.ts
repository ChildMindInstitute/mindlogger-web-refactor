import { useCallback, useEffect, useMemo } from "react"

import { useLocation } from "react-router-dom"

import { getDataFromProgressId } from "~/abstract/lib"
import { appletModel, useAppletByIdQuery } from "~/entities/applet"
import { useEventsByAppletIdMutation, useUserEventsMutation } from "~/entities/event"
import { ROUTES } from "~/shared/constants"
import { matchPaths } from "~/shared/utils"
import { useAppSelector } from "~/shared/utils"
import { useActivityDetailsQuery, useAnswer } from "~/widgets/ActivityDetails/model/hooks"
import { useBaseQuery } from "~/shared/api"
import { useAppletByIdMutation } from "~/entities/applet/api/useAppletByIdMutation"

const AVAILABLE_PATHS = [ROUTES.profile.path, ROUTES.settings.path, ROUTES.appletList.path]

export const useEntityProgressAutoCompletion = () => {
  const location = useLocation()
  const { processAnswers } = useAnswer()
  const { mutateAsync: aaa } = useAppletByIdMutation()
  const { mutateAsync: asfaf } = useEventsByAppletIdMutation()
  // const { activityDetails, isLoading, isError, error, appletDetails, eventsRawData, respondentMeta } =
  //   useActivityDetailsQuery({
  //     appletId,
  //   })

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

    console.info({ progressEntityEvents })

    // const answer = processAnswers({
    //   applet,
    //   activityId,
    //   eventId,
    //   eventsRawData: props.eventsRawData,
    //   flowId: flowParams.isFlow ? flowParams.flowId : null,
    //   items,
    //   userEvents,
    //   isPublic: context.isPublic,
    // })
  }, [applets.groupProgress, getUserEvents, progressKeys])

  useEffect(() => {
    if (isValidPath && !isProgressEmpty) {
      performAutoCompletion()
    }
  }, [isProgressEmpty, isValidPath, performAutoCompletion])
}
