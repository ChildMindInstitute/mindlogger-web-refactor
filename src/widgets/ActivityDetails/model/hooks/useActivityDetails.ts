import { useItemsInProgress } from "./useItemsInProgress"

import { useActivityByIdQuery } from "~/entities/activity"
import { useAppletByIdQuery } from "~/entities/applet"
import { useEventsbyAppletIdQuery } from "~/entities/event"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, BaseError } from "~/shared/api"

type PrivateProps = {
  isPublic: false

  appletId: string
  activityId: string
  eventId: string
}

type PublicProps = {
  isPublic: true

  appletId: string
  activityId: string
  eventId: string

  publicAppletKey: string
}

type Props = PrivateProps | PublicProps

export interface ActivityEvents {
  eventId: string
  activityId: string
}

interface UseActivityDetailsReturn {
  isActivityEventInProgress: boolean
  appletDetails: AppletDetailsDTO | null
  activityDetails: ActivityDTO | null
  eventsRawData: AppletEventsResponse | null
  isError: boolean
  isLoading: boolean
  error: BaseError | null
}

export const useActivityDetails = (props: Props): UseActivityDetailsReturn => {
  const { currentActivityEventProgress } = useItemsInProgress(props.eventId, props.activityId)

  const isActivityEventInProgress = currentActivityEventProgress.length > 0

  const {
    data: appletById,
    isError: isAppletError,
    isLoading: isAppletLoading,
    error: appletError,
  } = useAppletByIdQuery(
    props.isPublic
      ? { isPublic: props.isPublic, publicAppletKey: props.publicAppletKey }
      : { isPublic: props.isPublic, appletId: props.appletId },
  )

  const {
    data: activityById,
    isError: isActivityError,
    isLoading: isActivityLoading,
    error: activityError,
  } = useActivityByIdQuery({ isPublic: props.isPublic, activityId: props.activityId })

  const {
    data: eventsByIdData,
    isError: isEventsError,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useEventsbyAppletIdQuery(
    props.isPublic
      ? { isPublic: props.isPublic, publicAppletKey: props.publicAppletKey }
      : { isPublic: props.isPublic, appletId: props.appletId },
  )

  return {
    isActivityEventInProgress,
    appletDetails: appletById?.data?.result ?? null,
    activityDetails: activityById?.data?.result ?? null,
    eventsRawData: eventsByIdData?.data?.result ?? null,
    isError: isAppletError || isActivityError || isEventsError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading,
    error: appletError ?? activityError ?? eventsError,
  }
}
