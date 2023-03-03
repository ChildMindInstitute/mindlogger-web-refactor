import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

export const activitySelector = (state: RootState) => state.activity
export const activityDetailsSelector = createSelector(activitySelector, activity => activity.activityDetails)
export const activitiesInProgressSelector = createSelector(activitySelector, activity => activity.activitiesInProgress)
