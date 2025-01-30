import { createSelector } from '@reduxjs/toolkit';

import { GroupProgressId } from '~/abstract/lib';
import { RootState } from '~/shared/utils';

const selectGroupProgressId = (_: unknown, groupProgressId: GroupProgressId) => groupProgressId;

export const appletsSelector = (state: RootState) => state.applets;

export const groupProgressSelector = createSelector(
  appletsSelector,
  (applets) => applets.groupProgress,
);

export const selectGroupProgress = createSelector(
  [groupProgressSelector, selectGroupProgressId],
  (groupProgress, groupProgressId) => groupProgress[groupProgressId],
);

export const activityProgressSelector = createSelector(
  appletsSelector,
  (applets) => applets.progress,
);

export const selectActivityProgress = createSelector(
  [activityProgressSelector, selectGroupProgressId],
  (progress, entityId) => progress[entityId],
);

export const completedEntitiesSelector = createSelector(
  appletsSelector,
  (activity) => activity.completedEntities,
);

export const entityCompletionsSelector = createSelector(
  appletsSelector,
  (activity) => activity.completions,
);

export const multiInformantStateSelector = createSelector(
  appletsSelector,
  (state) => state.multiInformantState,
);

export const prolificParamsSelector = createSelector(
  appletsSelector,
  (state) => state.prolificParams,
);

export const selectConsents = createSelector(appletsSelector, (applets) => applets.consents);
