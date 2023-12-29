import { useContext } from "react"

import { ActivityDetailsContext } from "../../lib"
import { useItemsInProgress } from "./useItemsInProgress"

import { useActivityByIdQuery } from "~/entities/activity"
import { useAppletByIdQuery } from "~/entities/applet"
import { useEventsbyAppletIdQuery } from "~/entities/event"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, BaseError, RespondentMetaDTO } from "~/shared/api"

export interface ActivityEvents {
  eventId: string
  activityId: string
}

interface UseActivityDetailsReturn {
  isActivityEventInProgress: boolean
  appletDetails: AppletDetailsDTO | null
  respondentMeta?: RespondentMetaDTO
  activityDetails: ActivityDTO | null
  eventsRawData: AppletEventsResponse | null
  isError: boolean
  isLoading: boolean
  error: BaseError | null
}

export const useActivityDetails = (): UseActivityDetailsReturn => {
  const context = useContext(ActivityDetailsContext)

  const { currentActivityEventProgress } = useItemsInProgress(context.eventId, context.activityId)

  const isActivityEventInProgress = currentActivityEventProgress.length > 0

  const {
    data: appletById,
    isError: isAppletError,
    isLoading: isAppletLoading,
    error: appletError,
  } = useAppletByIdQuery(
    context.isPublic
      ? { isPublic: context.isPublic, publicAppletKey: context.publicAppletKey }
      : { isPublic: context.isPublic, appletId: context.appletId },
  )

  const {
    data: activityById,
    isError: isActivityError,
    isLoading: isActivityLoading,
    error: activityError,
  } = useActivityByIdQuery({ isPublic: context.isPublic, activityId: context.activityId })

  const {
    data: eventsByIdData,
    isError: isEventsError,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useEventsbyAppletIdQuery(
    context.isPublic
      ? { isPublic: context.isPublic, publicAppletKey: context.publicAppletKey }
      : { isPublic: context.isPublic, appletId: context.appletId },
  )

  return {
    isActivityEventInProgress,
    appletDetails: appletById?.data?.result ?? null,
    respondentMeta: appletById?.data?.respondentMeta,
    activityDetails: activityById?.data?.result ?? null,
    eventsRawData: eventsByIdData?.data?.result ?? null,
    isError: isAppletError || isActivityError || isEventsError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading,
    error: appletError ?? activityError ?? eventsError,
  }
}
