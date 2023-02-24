import { useAppletByIdQuery } from "../../ActivityGroups"
import { mockActivityDetails } from "./activityList.mock"

import { ActivityListItem } from "~/entities/activity"
import { AppletDetailsDto } from "~/shared/api"

interface UseActivityDetailsProps {
  appletId: string
  activityId: string
}

interface UseActivityDetailsReturn {
  appletDetails: AppletDetailsDto | undefined
  activityDetails: ActivityListItem | undefined
  isError: boolean
  isLoading: boolean
}

export const useActivityDetails = ({ appletId }: UseActivityDetailsProps): UseActivityDetailsReturn => {
  const {
    data: appletById,
    isError: isAppletError,
    isLoading: isAppletLoading,
  } = useAppletByIdQuery({ isPublic: false, appletId })
  // const { data: activityById } = useActivityByIdQuery({ activityId }) | temporarl
  const activityById = mockActivityDetails

  return {
    appletDetails: appletById?.data?.result,
    activityDetails: activityById,
    isError: isAppletError,
    isLoading: isAppletLoading,
  }
}
