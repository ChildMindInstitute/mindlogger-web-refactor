import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/shared/utils';

const selectEntityId = (_: unknown, entityId: string) => entityId;

export const selectAutoCompletionState = (state: RootState) => state.autoCompletion;

export const selectAutoCompletion = createSelector(
  [selectAutoCompletionState, selectEntityId],
  (autoCompletionState, entityId) => autoCompletionState[entityId],
);
