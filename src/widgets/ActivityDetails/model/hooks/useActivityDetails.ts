import { useMemo } from "react"

import { ActivityDetails, ActivityListItem, activityModel, useActivityByIdQuery } from "~/entities/activity"
import { ActivityFlow, AppletDetails, appletModel, useAppletByIdQuery } from "~/entities/applet"

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

  const appletDetails = useMemo(() => {
    return appletModel.appletBuilder.convertToAppletDetails(appletById?.data?.result)
  }, [appletById?.data?.result])

  const activityDetails = useMemo(() => {
    return activityModel.activityBuilder.convertToActivityDetails(activityById?.data?.result)
  }, [activityById?.data?.result])

  return {
    appletDetails,
    activityDetails,
    isError: isAppletError || isActivityError,
    isLoading: isAppletLoading || isActivityLoading,
  }
}
