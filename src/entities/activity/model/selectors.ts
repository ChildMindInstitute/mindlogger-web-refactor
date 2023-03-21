import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

export const activitySelector = (state: RootState) => state.activity
export const groupsInProgressSelector = createSelector(activitySelector, activity => activity.groupsInProgress)
