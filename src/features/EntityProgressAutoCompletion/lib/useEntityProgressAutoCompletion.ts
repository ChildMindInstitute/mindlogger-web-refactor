import { useCallback, useEffect } from "react"

import { useLocation } from "react-router-dom"

import { appletModel } from "~/entities/applet"
import { useUserEventsMutation } from "~/entities/event"
import { ROUTES } from "~/shared/constants"
import { matchPaths } from "~/shared/utils"
import { useAppSelector } from "~/shared/utils"

const AVAILABLE_PATHS = [ROUTES.profile.path, ROUTES.settings.path, ROUTES.appletList.path]

export const useEntityProgressAutoCompletion = () => {
  const location = useLocation()

  const { mutateAsync } = useUserEventsMutation()

  const applets = useAppSelector(appletModel.selectors.appletsSelector)

  const isProgressEmpty = Object.keys(applets.groupProgress).length === 0

  const isValidPath = matchPaths(AVAILABLE_PATHS, location.pathname).some(Boolean)

  const performAutoCompletion = useCallback(async () => {
    // Here logic for auto completion

    // Step 1: Get all events from request
    const userEventsData = await mutateAsync(undefined)
    const userEvents = userEventsData.data?.result

    console.log(userEvents)
    // Step 2: Get all groupProgress by AvailabilityGroupBuilder
  }, [mutateAsync])

  useEffect(() => {
    if (isValidPath && !isProgressEmpty) {
      performAutoCompletion()
    }
  }, [isProgressEmpty, isValidPath, performAutoCompletion])
}
