import { useMemo } from "react"

import { ActivityDetails, ActivityListItem, activityModel, useActivityByIdQuery } from "~/entities/activity"
import { ActivityFlow, AppletDetails, appletModel, useAppletByIdQuery } from "~/entities/applet"
import { useEventsbyAppletIdQuery } from "~/entities/event"

interface UseActivityDetailsProps {
  appletId: string
  activityId: string
}

export interface ActivityEvents {
  eventId: string
  activityId: string
}

interface UseActivityDetailsReturn {
  appletDetails: AppletDetails<ActivityListItem, ActivityFlow> | null
  activityDetails: ActivityDetails | null
  activityEvents: ActivityEvents[]
  isError: boolean
  isLoading: boolean
}

export const useActivityDetails = ({ appletId, activityId }: UseActivityDetailsProps): UseActivityDetailsReturn => {
  const {
    data: appletById,
    isError: isAppletError,
    isLoading: isAppletLoading,
  } = useAppletByIdQuery({ isPublic: false, appletId })
  const {
    data: activityById,
    isError: isActivityError,
    isLoading: isActivityLoading,
  } = useActivityByIdQuery({ activityId })
  const {
    data: eventsData,
    isError: isEventsError,
    isLoading: isEventsLoading,
  } = useEventsbyAppletIdQuery({ appletId })

  const appletDetails = useMemo(() => {
    return appletModel.appletBuilder.convertToAppletDetails(appletById?.data?.result)
  }, [appletById?.data?.result])

  const activityDetails = useMemo(() => {
    return activityModel.activityBuilder.convertToActivityDetails(activityById?.data?.result)
  }, [activityById?.data?.result])

  const activityEvents = useMemo(() => {
    return eventsData?.data?.result.map(event => ({
      eventId: event.id,
      activityId: event.activityId,
    }))
  }, [eventsData?.data?.result])

  return {
    appletDetails,
    activityDetails,
    activityEvents: activityEvents ?? [],
    isError: isAppletError || isActivityError || isEventsError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading,
  }
}
