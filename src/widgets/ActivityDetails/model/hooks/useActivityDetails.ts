import { useEffect, useMemo } from "react"

import { ActivityListItem, activityModel, useActivityByIdQuery } from "~/entities/activity"
import { ActivityFlow, AppletDetails, appletModel, useAppletByIdQuery } from "~/entities/applet"
import { useEventsbyAppletIdQuery } from "~/entities/event"
import { ActivityDTO } from "~/shared/api"

interface UseActivityDetailsProps {
  appletId: string
  activityId: string
  eventId: string
}

export interface ActivityEvents {
  eventId: string
  activityId: string
}

interface UseActivityDetailsReturn {
  appletDetails: AppletDetails<ActivityListItem, ActivityFlow> | null
  activityDetails: ActivityDTO | null
  isError: boolean
  isLoading: boolean
}

type UseActivityDetailsParams = {
  isRestart: boolean
}

export const useActivityDetails = (
  { appletId, activityId, eventId }: UseActivityDetailsProps,
  params: UseActivityDetailsParams,
): UseActivityDetailsReturn => {
  const { saveActivityEventRecords, resetActivityEventRecordsByParams } =
    activityModel.hooks.useSaveActivityEventProgress()

  useEffect(() => {
    if (params.isRestart) {
      resetActivityEventRecordsByParams(activityId, eventId)
    }
  }, [activityId, eventId, params.isRestart, resetActivityEventRecordsByParams])

  const {
    data: appletById,
    isError: isAppletError,
    isLoading: isAppletLoading,
  } = useAppletByIdQuery({ isPublic: false, appletId })

  const appletDetailsRawData = useMemo(() => {
    return appletById?.data?.result
  }, [appletById?.data?.result])

  const {
    data: activityById,
    isError: isActivityError,
    isLoading: isActivityLoading,
  } = useActivityByIdQuery(
    { activityId },
    {
      onSuccess(data) {
        if (!params.isRestart) {
          return
        }

        const activityDetails = activityModel.activityBuilder.convertToActivityDetails(data?.data?.result)

        if (activityDetails) {
          const initialStep = 1
          return saveActivityEventRecords(activityDetails, eventId, initialStep)
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
  } = useEventsbyAppletIdQuery({ appletId })

  const eventsRawData = useMemo(() => {
    return eventsByIdData?.data?.result
  }, [eventsByIdData?.data?.result])

  const appletDetails = useMemo(() => {
    return appletModel.appletBuilder.convertToAppletDetails(appletDetailsRawData, eventsRawData)
  }, [appletDetailsRawData, eventsRawData])

  return {
    appletDetails,
    activityDetails: activityDetailsRawData ?? null,
    isError: isAppletError || isActivityError || isEventsError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading,
  }
}
