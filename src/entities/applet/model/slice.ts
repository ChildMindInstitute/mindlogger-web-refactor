import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidV4 } from 'uuid';

import {
  ChangeSummaryScreenVisibilityPayload,
  CompletedEntitiesState,
  CompletedEventEntities,
  ItemTimerTickPayload,
  InProgressActivity,
  InProgressEntity,
  InProgressFlow,
  MultiInformantPayload,
  ProgressState,
  RemoveActivityProgressPayload,
  SaveActivityProgressPayload,
  SaveGroupContextPayload,
  SaveGroupProgressPayload,
  SaveItemAdditionalTextPayload,
  SaveItemAnswerPayload,
  SaveUserEventPayload,
  SetItemTimerPayload,
  UpdateStepPayload,
  UpdateUserEventByIndexPayload,
} from './types';

import {
  ActivityConsents,
  ActivityPipelineType,
  FlowProgress,
  getProgressId,
  GroupProgress,
  GroupProgressState,
} from '~/abstract/lib';
import { MultiInformantState } from '~/abstract/lib/types/multiInformant';

type InitialState = {
  groupProgress: GroupProgressState;
  progress: ProgressState;
  completedEntities: CompletedEntitiesState;
  completions: CompletedEventEntities;
  multiInformantState: MultiInformantState;
  consents: ActivityConsents;
};

const initialState: InitialState = {
  groupProgress: {},
  progress: {},
  completedEntities: {},
  completions: {},
  multiInformantState: {},
  consents: {},
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

    saveGroupContext: (state, action: PayloadAction<SaveGroupContextPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      const groupProgress = state.groupProgress[id] ?? {};

      const updatedContext = {
        ...groupProgress.context,
        ...action.payload.context,
      };

      state.groupProgress[id] = {
        ...groupProgress,
        context: updatedContext,
      };
    },

    saveActivityProgress: (state, action: PayloadAction<SaveActivityProgressPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      state.progress[id] = action.payload.progress;
    },

    changeSummaryScreenVisibility: (
      state,
      action: PayloadAction<ChangeSummaryScreenVisibilityPayload>,
    ) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      const activityProgress = state.progress[id];

      activityProgress.isSummaryScreenOpen = action.payload.isSummaryScreenOpen;
    },

    setItemTimerStatus: (state, action: PayloadAction<SetItemTimerPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      const progress = state.progress[id];

      if (!progress.itemTimer) {
        progress.itemTimer = {};
      }

      progress.itemTimer[action.payload.itemId] = action.payload.timerStatus;
    },

    itemTimerTick: (state, action: PayloadAction<ItemTimerTickPayload>) => {
      const id = getProgressId(action.payload.activityId, action.payload.eventId);

      const progress = state.progress[id];

      if (!progress) return state;

      const timer = progress.itemTimer[action.payload.itemId];

      if (!timer) return state;

      if (timer.duration > timer.spentTime) {
        timer.spentTime += 1;
      }
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
        context: {
          summaryData: {},
        },
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
        context: {
          summaryData: {},
        },
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

    initiateTakeNow: (state, action: PayloadAction<MultiInformantPayload>) => {
      state.multiInformantState = action.payload;
    },

    ensureMultiInformantStateExists: (state) => {
      if (!state.multiInformantState) {
        state.multiInformantState = {};
      }
    },

    resetMultiInformantState: (state) => {
      state.multiInformantState = {};
    },

    applyDataSharingSettings: (state, action: PayloadAction<{ appletId: string }>) => {
      const { appletId } = action.payload;

      state.consents[appletId] = {
        shareToPublic: true,
        shareMediaToPublic: true,
      };
    },

    removeDataSharingSettings: (state, action: PayloadAction<{ appletId: string }>) => {
      const { appletId } = action.payload;

      delete state.consents[appletId];
    },

    toggleShareConsent: (state, action: PayloadAction<{ appletId: string }>) => {
      const { appletId } = action.payload;

      const consents = state.consents[appletId];

      if (!consents) {
        return;
      }

      const currentValue = consents.shareToPublic;

      consents.shareToPublic = !currentValue;
      consents.shareMediaToPublic = !currentValue;
    },

    toggleMediaConsent: (state, action: PayloadAction<{ appletId: string }>) => {
      const { appletId } = action.payload;

      const consents = state.consents[appletId];

      if (!consents) {
        return;
      }

      const currentValue = consents.shareMediaToPublic;

      consents.shareMediaToPublic = !currentValue;
    },
  },
});

export const actions = appletsSlice.actions;
export const reducer = appletsSlice.reducer;
