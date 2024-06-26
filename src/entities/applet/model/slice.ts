import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidV4 } from 'uuid';

import {
  ProgressState,
  RemoveActivityProgressPayload,
  CompletedEntitiesState,
  CompletedEventEntities,
  InProgressActivity,
  InProgressEntity,
  InProgressFlow,
  SaveItemAnswerPayload,
  SaveActivityProgressPayload,
  SaveUserEventPayload,
  UpdateStepPayload,
  UpdateUserEventByIndexPayload,
  SaveGroupProgressPayload,
  SaveItemAdditionalTextPayload,
} from './types';

import {
  ActivityPipelineType,
  GroupProgress,
  FlowProgress,
  getProgressId,
  GroupProgressState,
} from '~/abstract/lib';

type InitialState = {
  groupProgress: GroupProgressState;
  progress: ProgressState;
  completedEntities: CompletedEntitiesState;
  completions: CompletedEventEntities;
};

const initialState: InitialState = {
  groupProgress: {},
  progress: {},
  completedEntities: {},
  completions: {},
};

const appletsSlice = createSlice({
  name: 'applets',
  initialState,
  reducers: {
    resetAppletsStore: () => {
      return initialState;
    },

    removeActivityProgress: (state, action: PayloadAction<RemoveActivityProgressPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      delete state.progress[id];
    },

    saveGroupProgress: (state, action: PayloadAction<SaveGroupProgressPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      const groupProgress = state.groupProgress[id] ?? {};

      const updatedProgress = {
        ...groupProgress,
        ...action.payload.progressPayload,
      };

      state.groupProgress[id] = updatedProgress;
    },

    saveActivityProgress: (state, action: PayloadAction<SaveActivityProgressPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      state.progress[id] = action.payload.progress;
    },

    saveItemAnswer: (state, action: PayloadAction<SaveItemAnswerPayload>) => {
      const id = getProgressId(action.payload.entityId, action.payload.eventId);
      const activityProgress = state.progress[id];

      if (!activityProgress) {
        return state;
      }

      const itemIndex = activityProgress.items.findIndex(({ id }) => id === action.payload.itemId);

      if (itemIndex === -1) {
        return state;
      }

      activityProgress.items[itemIndex].answer = action.payload.answer;
    },

    /**
     * Reducer for saving additionaltext
     * @param state
     * @param action
     * @returns
     */
    saveAdditionalText: (state, action: PayloadAction<SaveItemAdditionalTextPayload>) => {
      const id = getProgressId(action.payload.entityId, action.payload.eventId);
      const activityProgress = state.progress[id];

      if (!activityProgress) {
        return state;
      }

      const itemIndex = activityProgress.items.findIndex(({ id }) => id === action.payload.itemId);

      if (itemIndex === -1) {
        return state;
      }

      activityProgress.items[itemIndex].additionalText = action.payload.additionalText;
    },

    saveUserEvent: (state, action: PayloadAction<SaveUserEventPayload>) => {
      const id = getProgressId(action.payload.entityId, action.payload.eventId);
      const activityProgress = state.progress[id];

      if (!activityProgress) {
        return state;
      }

      activityProgress.userEvents.push(action.payload.userEvent);
    },
    updateUserEventByIndex: (state, action: PayloadAction<UpdateUserEventByIndexPayload>) => {
      const id = getProgressId(action.payload.entityId, action.payload.eventId);
      const activityProgress = state.progress[id];

      if (!activityProgress) {
        return state;
      }

      if (!activityProgress.userEvents[action.payload.userEventIndex]) {
        return state;
      }

      activityProgress.userEvents[action.payload.userEventIndex] = action.payload.userEvent;
    },

    incrementStep: (state, action: PayloadAction<UpdateStepPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      const activityProgress = state.progress[id];

      activityProgress.step += 1;
    },

    decrementStep: (state, action: PayloadAction<UpdateStepPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      const activityProgress = state.progress[id];

      activityProgress.step -= 1;
    },

    activityStarted: (state, action: PayloadAction<InProgressActivity>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      const activityEvent: GroupProgress = {
        type: ActivityPipelineType.Regular,
        startAt: new Date().getTime(),
        endAt: null,
      };

      state.groupProgress[id] = activityEvent;
    },

    flowStarted: (state, action: PayloadAction<InProgressFlow>) => {
      const id = getProgressId(action.payload.flowId, action.payload.eventId);

      const flowEvent: GroupProgress = {
        type: ActivityPipelineType.Flow,
        currentActivityId: action.payload.activityId,
        startAt: new Date().getTime(),
        currentActivityStartAt: new Date().getTime(),
        endAt: null,
        executionGroupKey: uuidV4(),
        pipelineActivityOrder: action.payload.pipelineActivityOrder,
      };

      state.groupProgress[id] = flowEvent;
    },

    flowUpdated: (state, action: PayloadAction<InProgressFlow>) => {
      const id = getProgressId(action.payload.flowId, action.payload.eventId);

      const groupProgress = state.groupProgress[id] as FlowProgress;

      groupProgress.currentActivityId = action.payload.activityId;
      groupProgress.pipelineActivityOrder = action.payload.pipelineActivityOrder;
      groupProgress.currentActivityStartAt = new Date().getTime();
    },

    entityCompleted: (state, action: PayloadAction<InProgressEntity>) => {
      const id = getProgressId(action.payload.entityId, action.payload.eventId);

      state.groupProgress[id].endAt = new Date().getTime();

      const completedEntities = state.completedEntities ?? {};

      const completions = state.completions ?? {};

      const now = new Date().getTime();

      completedEntities[action.payload.entityId] = now;

      if (!completions[action.payload.entityId]) {
        completions[action.payload.entityId] = {};
      }

      const entityCompletions = completions[action.payload.entityId];

      if (!entityCompletions[action.payload.eventId]) {
        entityCompletions[action.payload.eventId] = [];
      }
      entityCompletions[action.payload.eventId].push(now);
    },
  },
});

export const actions = appletsSlice.actions;
export const reducer = appletsSlice.reducer;
