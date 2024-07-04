import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/shared/utils';

const autoCompletionId = (_: unknown, autoCompletionId: string) => autoCompletionId;

export const selectAutoCompletionState = (state: RootState) => state.autoCompletion;

export const selectAutoCompletion = createSelector(
  [selectAutoCompletionState, autoCompletionId],
  (autoCompletion, id) => autoCompletion[id],
);
