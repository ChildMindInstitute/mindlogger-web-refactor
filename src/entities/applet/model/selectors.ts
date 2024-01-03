import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

export const appletsSelector = (state: RootState) => state.applets

export const groupsInProgressSelector = createSelector(appletsSelector, applets => applets.groupsInProgress)

export const activityEventProgressSelector = createSelector(appletsSelector, applets => applets.activityEventProgress)

const selectEntityId = (_: unknown, entityId: string) => entityId

export const selectActivityProgress = createSelector(
  [activityEventProgressSelector, selectEntityId],
  (progress, entityId) => progress[entityId],
)

export const completedEntitiesSelector = createSelector(appletsSelector, activity => activity.completedEntities)

export const entityCompletionsSelector = createSelector(appletsSelector, activity => activity.completions)
