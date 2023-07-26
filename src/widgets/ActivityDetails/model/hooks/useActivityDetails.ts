import { useEffect, useMemo } from "react"

import { ActivityListItem, activityModel, useActivityByIdQuery } from "~/entities/activity"
import { ActivityFlow, AppletDetails, appletModel, useAppletByIdQuery } from "~/entities/applet"
import { useEventsbyAppletIdQuery } from "~/entities/event"
import { ActivityDTO, AppletEventsResponse, BaseError } from "~/shared/api"

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
  appletDetails: AppletDetails<ActivityListItem, ActivityFlow> | null
  activityDetails: ActivityDTO | null
  eventsRawData: AppletEventsResponse | undefined
  isError: boolean
  isLoading: boolean
  error: BaseError | null
}

type UseActivityDetailsParams = {
  isRestart: boolean
}

export const useActivityDetails = (props: Props, params: UseActivityDetailsParams): UseActivityDetailsReturn => {
  const { saveActivityEventRecords, resetActivityEventRecordsByParams } =
    activityModel.hooks.useSaveActivityEventProgress()

  useEffect(() => {
    if (params.isRestart) {
      resetActivityEventRecordsByParams(props.activityId, props.eventId)
    }
  }, [props.activityId, props.eventId, params.isRestart, resetActivityEventRecordsByParams])

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

  const appletDetailsRawData = useMemo(() => {
    return appletById?.data?.result
  }, [appletById?.data?.result])

  const {
    data: activityById,
    isError: isActivityError,
    isLoading: isActivityLoading,
    error: activityError,
  } = useActivityByIdQuery(
    { isPublic: props.isPublic, activityId: props.activityId },
    {
      onSuccess(data) {
        if (!params.isRestart) {
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

  const eventsRawData = useMemo(() => {
    return eventsByIdData?.data?.result
  }, [eventsByIdData?.data?.result])

  const appletDetails = useMemo(() => {
    return appletModel.appletBuilder.convertToAppletDetails(appletDetailsRawData, eventsRawData)
  }, [appletDetailsRawData, eventsRawData])

  return {
    appletDetails,
    activityDetails: activityDetailsRawData ?? null,
    eventsRawData,
    isError: isAppletError || isActivityError || isEventsError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading,
    error: appletError ?? activityError ?? eventsError,
  }
}
