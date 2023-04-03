import { useEffect } from "react"

import { activityDetailsWithItemsMock, activityModel } from "~/entities/activity"

type UseMockActivityDetailsProps = {
  eventId: string
  activityId: string
  isRestart: boolean
}

export const useMockActivityDetails = ({ eventId, isRestart }: UseMockActivityDetailsProps) => {
  const { saveActivityEventRecords } = activityModel.hooks.useSaveActivityEventProgress()

  const activityDetails = activityModel.activityBuilder.convertToActivityDetails(activityDetailsWithItemsMock)

  useEffect(() => {
    if (!isRestart) {
      return
    }

    if (activityDetails) {
      const initialStep = 1
      saveActivityEventRecords(activityDetails, eventId, initialStep)
    }
  }, [activityDetails, eventId, isRestart, saveActivityEventRecords])

  return {
    isActivityError: false,
    isActivityLoading: false,
    activityById: {
      data: {
        result: activityDetails,
      },
    },
  }
}
