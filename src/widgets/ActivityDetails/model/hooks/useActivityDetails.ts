import { useEffect, useMemo } from "react"

import { ActivityDetails, ActivityListItem, activityModel, useActivityByIdQuery } from "~/entities/activity"
import { ActivityFlow, AppletDetails, appletModel, useAppletByIdQuery } from "~/entities/applet"

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
  activityDetails: ActivityDetails | null
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
