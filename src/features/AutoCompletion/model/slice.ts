import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getProgressId } from '~/abstract/lib';

type DefaultProps = {
  entityId: string;
  eventId: string;
};

export type SetAutoCompletionPayload = DefaultProps & {
  autoCompletion: AutoCompletion;
};

type ProgressId = string; // `entityId/eventId where entityId is activityId or flowId`;

type AutoCompletion = {
  successfullySubmittedActivityIds: string[]; // List of successfully submitted activities

  activityIdsToSubmit: string[]; // List of activities that should be submitted
};

type InitialState = Record<ProgressId, AutoCompletion>;

const initialState: InitialState = {};

const slice = createSlice({
  name: 'autoCompletion',
  initialState,
  reducers: {
    clearAutoCompletionState() {
      return initialState;
    },

    setAutoCompletion(state, action: PayloadAction<SetAutoCompletionPayload>) {
      const { entityId, eventId, autoCompletion } = action.payload;
      const progressId = getProgressId(entityId, eventId);

      state[progressId] = autoCompletion;
    },

    removeAutoCompletion(state, action: PayloadAction<DefaultProps>) {
      const { entityId, eventId } = action.payload;
      const progressId = getProgressId(entityId, eventId);

      delete state[progressId];
    },

    activitySuccessfullySubmitted(
      state,
      action: PayloadAction<DefaultProps & { activityId: string }>,
    ) {
      const { entityId, eventId, activityId } = action.payload;
      const progressId = getProgressId(entityId, eventId);

      state[progressId].successfullySubmittedActivityIds.push(activityId);
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
