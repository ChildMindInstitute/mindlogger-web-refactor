import { useMemo } from "react"

import { useItemsInProgress } from "./useItemsInProgress"

import { activityModel, useActivityByIdQuery } from "~/entities/activity"
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
  appletDetails: AppletDetailsDTO | null
  activityDetails: ActivityDTO | null
  eventsRawData: AppletEventsResponse | null
  isError: boolean
  isLoading: boolean
  error: BaseError | null
}

export const useActivityDetails = (props: Props): UseActivityDetailsReturn => {
  const { currentActivityEventProgress } = useItemsInProgress(props.eventId, props.activityId)

  const { saveActivityEventRecords } = activityModel.hooks.useSaveActivityEventProgress()

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
  } = useActivityByIdQuery(
    { isPublic: props.isPublic, activityId: props.activityId },
    {
      onSuccess(data) {
        if (isActivityEventInProgress) {
          return
        }

        if (data?.data?.result) {
          const initialStep = 1
          return saveActivityEventRecords(data?.data?.result, props.eventId, initialStep)
        }
      },
    },
  )

  const activityDetailsRawData = useMemo(() => {
    return activityById?.data?.result
  }, [activityById?.data?.result])

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
    appletDetails: appletById?.data?.result ?? null,
    activityDetails: activityDetailsRawData ?? null,
    eventsRawData: eventsByIdData?.data?.result ?? null,
    isError: isAppletError || isActivityError || isEventsError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading,
    error: appletError ?? activityError ?? eventsError,
  }
}
