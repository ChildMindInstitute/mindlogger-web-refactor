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
  SaveGroupProgressPayload,
  SaveItemAdditionalTextPayload,
  SaveItemAnswerPayload,
  SaveUserEventPayload,
  SetItemTimerPayload,
  UpdateStepPayload,
  UpdateUserEventByIndexPayload,
  RemoveGroupProgressPayload,
  SaveSummaryDataInContext,
  ProlificUrlParamsPayload,
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
  prolificParams?: ProlificUrlParamsPayload;
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
    clearStore: () => {
      return initialState;
    },

    removeActivityProgress: (state, { payload }: PayloadAction<RemoveActivityProgressPayload>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      delete state.progress[id];
    },

    saveGroupProgress: (state, { payload }: PayloadAction<SaveGroupProgressPayload>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      const groupProgress = state.groupProgress[id] ?? {};

      const updatedProgress = {
        ...groupProgress,
        ...payload.progressPayload,
      };

      state.groupProgress[id] = updatedProgress;
    },

    removeGroupProgress: (state, { payload }: PayloadAction<RemoveGroupProgressPayload>) => {
      const id = getProgressId(payload.entityId, payload.eventId, payload.targetSubjectId);

      delete state.groupProgress[id];
    },

    saveSummaryDataInGroupContext: (
      state,
      { payload }: PayloadAction<SaveSummaryDataInContext>,
    ) => {
      const id = getProgressId(payload.entityId, payload.eventId, payload.targetSubjectId);

      const groupProgress = state.groupProgress[id] ?? {};

      const groupContext = groupProgress.context ?? {};

      groupContext.summaryData[payload.activityId] = payload.summaryData;
    },

    saveActivityProgress: (state, { payload }: PayloadAction<SaveActivityProgressPayload>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      state.progress[id] = payload.progress;
    },

    changeSummaryScreenVisibility: (
      state,
      { payload }: PayloadAction<ChangeSummaryScreenVisibilityPayload>,
    ) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      const activityProgress = state.progress[id];

      activityProgress.isSummaryScreenOpen = payload.isSummaryScreenOpen;
    },

    setItemTimerStatus: (state, { payload }: PayloadAction<SetItemTimerPayload>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      const progress = state.progress[id];

      if (!progress.itemTimer) {
        progress.itemTimer = {};
      }

      progress.itemTimer[payload.itemId] = payload.timerStatus;
    },

    removeItemTimerStatus: (state, { payload }: PayloadAction<ItemTimerTickPayload>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      const progress = state.progress[id];

      if (!progress) return state;

      const timer = progress.itemTimer[payload.itemId];

      if (timer) {
        delete progress.itemTimer[payload.itemId];
      }
    },

    itemTimerTick: (state, { payload }: PayloadAction<ItemTimerTickPayload>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      const progress = state.progress[id];

      if (!progress) return state;

      const timer = progress.itemTimer[payload.itemId];

      if (!timer) return state;

      if (timer.duration > timer.spentTime) {
        timer.spentTime += 1;
      }
    },

    saveItemAnswer: (state, { payload }: PayloadAction<SaveItemAnswerPayload>) => {
      const id = getProgressId(payload.entityId, payload.eventId, payload.targetSubjectId);
      const activityProgress = state.progress[id];

      if (!activityProgress) {
        return state;
      }

      const itemIndex = activityProgress.items.findIndex(({ id }) => id === payload.itemId);

      if (itemIndex === -1) {
        return state;
      }

      activityProgress.items[itemIndex].answer = payload.answer;
    },

    /**
     * Reducer for saving additionaltext
     * @param state
     * @param action
     * @returns
     */
    saveAdditionalText: (state, { payload }: PayloadAction<SaveItemAdditionalTextPayload>) => {
      const id = getProgressId(payload.entityId, payload.eventId, payload.targetSubjectId);
      const activityProgress = state.progress[id];

      if (!activityProgress) {
        return state;
      }

      const itemIndex = activityProgress.items.findIndex(({ id }) => id === payload.itemId);

      if (itemIndex === -1) {
        return state;
      }

      activityProgress.items[itemIndex].additionalText = payload.additionalText;
    },

    saveUserEvent: (state, { payload }: PayloadAction<SaveUserEventPayload>) => {
      const id = getProgressId(payload.entityId, payload.eventId, payload.targetSubjectId);
      const activityProgress = state.progress[id];

      if (!activityProgress) {
        return state;
      }

      activityProgress.userEvents.push(payload.userEvent);
    },
    updateUserEventByIndex: (state, { payload }: PayloadAction<UpdateUserEventByIndexPayload>) => {
      const id = getProgressId(payload.entityId, payload.eventId, payload.targetSubjectId);
      const activityProgress = state.progress[id];

      if (!activityProgress) {
        return state;
      }

      if (!activityProgress.userEvents[payload.userEventIndex]) {
        return state;
      }

      activityProgress.userEvents[payload.userEventIndex] = payload.userEvent;
    },

    incrementStep: (state, { payload }: PayloadAction<UpdateStepPayload>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      const activityProgress = state.progress[id];

      activityProgress.step += 1;
    },

    decrementStep: (state, { payload }: PayloadAction<UpdateStepPayload>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

      const activityProgress = state.progress[id];

      activityProgress.step -= 1;
    },

    activityStarted: (state, { payload }: PayloadAction<InProgressActivity>) => {
      const id = getProgressId(payload.activityId, payload.eventId, payload.targetSubjectId);

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

    flowStarted: (state, { payload }: PayloadAction<InProgressFlow>) => {
      const id = getProgressId(payload.flowId, payload.eventId, payload.targetSubjectId);

      const flowEvent: GroupProgress = {
        type: ActivityPipelineType.Flow,
        currentActivityId: payload.activityId,
        startAt: new Date().getTime(),
        currentActivityStartAt: new Date().getTime(),
        endAt: null,
        executionGroupKey: uuidV4(),
        pipelineActivityOrder: payload.pipelineActivityOrder,
        context: {
          summaryData: {},
        },
      };

      state.groupProgress[id] = flowEvent;
    },

    flowUpdated: (state, { payload }: PayloadAction<InProgressFlow>) => {
      const id = getProgressId(payload.flowId, payload.eventId, payload.targetSubjectId);

      const groupProgress = state.groupProgress[id] as FlowProgress;

      groupProgress.currentActivityId = payload.activityId;
      groupProgress.pipelineActivityOrder = payload.pipelineActivityOrder;
      groupProgress.currentActivityStartAt = new Date().getTime();
    },

    entityCompleted: (state, { payload }: PayloadAction<InProgressEntity>) => {
      const id = getProgressId(payload.entityId, payload.eventId, payload.targetSubjectId);

      state.groupProgress[id].endAt = new Date().getTime();

      const completedEntities = state.completedEntities ?? {};

      const completions = state.completions ?? {};

      const now = new Date().getTime();

      completedEntities[payload.entityId] = now;

      if (!completions[payload.entityId]) {
        completions[payload.entityId] = {};
      }

      const entityCompletions = completions[payload.entityId];

      if (!entityCompletions[payload.eventId]) {
        entityCompletions[payload.eventId] = [];
      }
      entityCompletions[payload.eventId].push(now);
    },

    initiateTakeNow: (state, action: PayloadAction<MultiInformantPayload>) => {
      state.multiInformantState = action.payload;
    },

    updateMultiInformantState: (state, action: PayloadAction<Partial<MultiInformantPayload>>) => {
      state.multiInformantState = {
        ...state.multiInformantState,
        ...action.payload,
      };
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

    saveProlificParams: (state, action: PayloadAction<ProlificUrlParamsPayload>) => {
      state.prolificParams = action.payload;
    },

    clearProlificParams: (state) => {
      state.prolificParams = undefined;
    },
  },
});

export const actions = appletsSlice.actions;
export const reducer = appletsSlice.reducer;
