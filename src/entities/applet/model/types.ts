import { GroupProgress } from '~/abstract/lib';
import {
  Answer,
  AudioPlayerItem,
  CheckboxItem,
  DateItem,
  MatrixMultiSelectAnswer,
  MessageItem,
  MultiSelectionRowsItem,
  RadioItem,
  SelectorItem,
  SingleMultiSelectAnswer,
  SingleSelectionRowsItem,
  SliderItem,
  SplashScreenItem,
  TextItem,
  TimeItem,
  TimeRangeItem,
} from '~/entities/activity/lib';
import { DayMonthYearDTO, HourMinuteDTO } from '~/shared/utils';

export type UserEventTypes = 'SET_ANSWER' | 'PREV' | 'NEXT' | 'SKIP' | 'DONE';

export type TimeRangeUserEventDto = {
  from: {
    hour: number;
    minute: number;
  };

  to: {
    hour: number;
    minute: number;
  };
};

export type UserEventResponse =
  | string
  | {
      value:
        | boolean
        | string
        | string[]
        | number[]
        | DayMonthYearDTO
        | HourMinuteDTO
        | TimeRangeUserEventDto
        | MatrixMultiSelectAnswer
        | SingleMultiSelectAnswer;
      text?: string;
    };

export type UserEvents = {
  type: UserEventTypes;
  time: number;
  screen: string;
  response?: UserEventResponse;
};

export type ItemRecord =
  | TextItem
  | CheckboxItem
  | RadioItem
  | SliderItem
  | SelectorItem
  | SplashScreenItem
  | MessageItem
  | DateItem
  | TimeItem
  | TimeRangeItem
  | AudioPlayerItem
  | MultiSelectionRowsItem
  | SingleSelectionRowsItem;

export type ItemWithAdditionalResponse = Extract<
  ItemRecord,
  | CheckboxItem
  | RadioItem
  | SliderItem
  | SelectorItem
  | DateItem
  | TimeItem
  | TimeRangeItem
  | AudioPlayerItem
>;

export type ActivityProgress = {
  items: ItemRecord[];
  step: number;
  userEvents: Array<UserEvents>;
};

type ProgressId = string; // Progress ID is a combination of activityId and eventId (activityId/eventId)

export type ProgressState = Record<ProgressId, ActivityProgress>;

// Payloads

export type SaveActivityProgressPayload = {
  activityId: string;
  eventId: string;
  progress: ActivityProgress;
};

export type RemoveActivityProgressPayload = {
  activityId: string;
  eventId: string;
};

export type SaveGroupProgressPayload = {
  activityId: string;
  eventId: string;
  progressPayload: GroupProgress;
};

export type SaveItemAnswerPayload = {
  entityId: string;
  eventId: string;
  itemId: string;
  answer: Answer;
};

export type SaveItemAdditionalTextPayload = {
  entityId: string;
  eventId: string;
  itemId: string;
  additionalText: string;
};

export type UpdateStepPayload = {
  activityId: string;
  eventId: string;
};

export type SaveUserEventPayload = {
  entityId: string;
  eventId: string;
  itemId: string;
  userEvent: UserEvents;
};

export type UpdateUserEventByIndexPayload = {
  entityId: string;
  eventId: string;
  userEventIndex: number;
  userEvent: UserEvents;
};

export type SupportableActivities = Record<string, boolean>;

export type CompletedEntitiesState = Record<string, number>;

export type EventCompletions = Record<string, number[]>;

export type CompletedEventEntities = Record<string, EventCompletions>;

export type InProgressEntity = {
  entityId: string;
  eventId: string;
};

export type InProgressActivity = {
  activityId: string;
  eventId: string;
};

export type InProgressFlow = {
  flowId: string;
  activityId: string;
  eventId: string;
  pipelineActivityOrder: number;
};
