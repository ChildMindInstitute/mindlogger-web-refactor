import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getProgressId } from '~/abstract/lib';

type DefaultProps = {
  entityId: string;
  eventId: string;
};

export type SetAutoCompletionPayload = DefaultProps & {
  autoCompletion: AutoCompletion;
};

export type SetAutoCompletionStatus = DefaultProps & {
  status: AutoCompletionStatus;
};

export type AutoCompletionStatus = 'notStarted' | 'inProgress' | 'completed';

type AutoCompletion = {
  status: AutoCompletionStatus;
  lastProcessedActivityId: string | null; // If null, then it means that auto completion is not started and we have no processed activities yet
};

type ProgressId = string; // `entityId/eventId where entityId is activityId or flowId`;

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

    setAutoCompletionStatus(state, action: PayloadAction<SetAutoCompletionStatus>) {
      const { entityId, eventId, status } = action.payload;
      const progressId = getProgressId(entityId, eventId);

      state[progressId].status = status;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
