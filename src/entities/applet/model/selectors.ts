import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/shared/utils';

const selectEntityId = (_: unknown, entityId: string) => entityId;

export const appletsSelector = (state: RootState) => state.applets;

export const groupProgressSelector = createSelector(appletsSelector, (applets) => applets.groupProgress);

export const selectGroupProgress = createSelector(
  [groupProgressSelector, selectEntityId],
  (groupProgress, entityId) => groupProgress[entityId],
);

export const activityProgressSelector = createSelector(appletsSelector, (applets) => applets.progress);

export const selectActivityProgress = createSelector(
  [activityProgressSelector, selectEntityId],
  (progress, entityId) => progress[entityId],
);

export const completedEntitiesSelector = createSelector(appletsSelector, (activity) => activity.completedEntities);

export const entityCompletionsSelector = createSelector(appletsSelector, (activity) => activity.completions);
