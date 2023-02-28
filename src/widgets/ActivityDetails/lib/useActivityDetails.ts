import { ActivityListItem, activityModel, useActivityByIdQuery } from "~/entities/activity"
import { AppletDetails, appletModel, useAppletByIdQuery } from "~/entities/applet"

interface UseActivityDetailsProps {
  appletId: string
  activityId: string
}

interface UseActivityDetailsReturn {
  appletDetails: AppletDetails | null
  activityDetails: ActivityListItem | null
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

  return {
    appletDetails: appletModel.appletBuilder.convertToAppletDetails(appletById?.data?.result),
    activityDetails: activityModel.activityBuilder.convertToActivityDetails(activityById?.data?.result),
    isError: isAppletError || isActivityError,
    isLoading: isAppletLoading || isActivityLoading,
  }
}
