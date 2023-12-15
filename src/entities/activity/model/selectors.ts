import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

export const activitySelector = (state: RootState) => state.activity
export const groupsInProgressSelector = createSelector(activitySelector, activity => activity.groupsInProgress)
export const activityEventProgressSelector = createSelector(
  activitySelector,
  activity => activity.activityEventProgress,
)
export const completedEntitiesSelector = createSelector(activitySelector, activity => activity.completedEntities)

export const entityCompletionsSelector = createSelector(activitySelector, activity => activity.completions)

export const selectConsents = createSelector(activitySelector, applets => applets.consents)

const selectAppletId = (_: any, appletId: string) => appletId

export const selectAppletConsents = createSelector(
  [selectConsents, selectAppletId],
  (consents, appletId) => consents[appletId],
)
