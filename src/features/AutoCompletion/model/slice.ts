import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ActivityPipelineType, getProgressId } from '~/abstract/lib';

type AutoCompletionID = string; // entityId/eventId

type AutoCompletionRegularState = {
  type: ActivityPipelineType.Regular;
  activityId: string;
  eventId: string;
};

type AutoCompletionFlowState = {
  type: ActivityPipelineType.Flow;
  flowId: string;
  eventId: string;

  currentActivityId: string;
  currentActivityIndex: number;

  activitiesInFlow: string[];
};

type AutoCompletionState = AutoCompletionFlowState | AutoCompletionRegularState;

type InitialState = Record<AutoCompletionID, AutoCompletionState>;

const initialState: InitialState = {};

const slice = createSlice({
  name: 'autoCompletion',
  initialState,
  reducers: {
    clearAutoCompletionState() {
      return initialState;
    },

    addAutoCompletionRecord(state, action: PayloadAction<AutoCompletionState>) {
      const { payload } = action;

      const progressId: AutoCompletionID =
        payload.type === ActivityPipelineType.Flow
          ? getProgressId(payload.flowId, payload.eventId)
          : getProgressId(payload.activityId, payload.eventId);

      state[progressId] = payload;
    },

    removeAutoCompletionRecord(state, action: PayloadAction<AutoCompletionID>) {
      delete state[action.payload];
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
