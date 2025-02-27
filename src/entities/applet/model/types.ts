import { FlowSummaryData, GroupProgress } from '~/abstract/lib';
import { MultiInformantState } from '~/abstract/lib/types/multiInformant';
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
  SliderRowsAnswer,
  SliderRowsItem,
  SplashScreenItem,
  TextItem,
  ParagraphTextItem,
  TimeItem,
  TimeRangeItem,
  PhrasalTemplateItem,
} from '~/entities/activity/lib';
import { ScoreAndReports } from '~/shared/api';
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
        | SingleMultiSelectAnswer
        | SliderRowsAnswer;
      text?: string;
    };

export type UserEvent = {
  type: UserEventTypes;
  time: number;
  screen: string;
  response?: UserEventResponse;
};

export type ItemRecord =
  | TextItem
  | ParagraphTextItem
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
  | SingleSelectionRowsItem
  | SliderRowsItem
  | PhrasalTemplateItem;

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
  userEvents: Array<UserEvent>;
  isSummaryScreenOpen: boolean;
  scoreSettings?: ScoreAndReports;
  itemTimer: ItemTimer;
};

type ItemId = string;

export type ItemTimer = Record<ItemId, ItemTimerProgress>;

export type ItemTimerProgress = {
  duration: number; // in seconds
  spentTime: number; // in seconds
};

type ProgressId = string; // Progress ID is a combination of activityId and eventId (activityId/eventId)

export type ProgressState = Record<ProgressId, ActivityProgress>;

// Payloads

export type SaveActivityProgressPayload = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  progress: ActivityProgress;
};

export type ChangeSummaryScreenVisibilityPayload = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  isSummaryScreenOpen: boolean;
};

export type SetItemTimerPayload = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  itemId: string;
  timerStatus: ItemTimerProgress;
};

export type ItemTimerTickPayload = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  itemId: string;
};

export type RemoveActivityProgressPayload = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export type RemoveGroupProgressPayload = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export type SaveGroupProgressPayload = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  progressPayload: GroupProgress;
};

export type SaveSummaryDataInContext = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;

  activityId: string;
  summaryData: FlowSummaryData;
};

export type SaveItemAnswerPayload = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
  itemId: string;
  answer: Answer;
};

export type SaveItemAdditionalTextPayload = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
  itemId: string;
  additionalText: string;
};

export type UpdateStepPayload = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export type SaveUserEventPayload = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
  itemId: string;
  userEvent: UserEvent;
};

export type UpdateUserEventByIndexPayload = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
  userEventIndex: number;
  userEvent: UserEvent;
};

export type ProlificUrlParamsPayload = {
  prolificPid: string;
  studyId: string;
  sessionId: string;
};

export type SupportableActivities = Record<string, boolean>;

export type CompletedEntitiesState = Record<string, number>;

export type EventCompletions = Record<string, number[]>;

export type CompletedEventEntities = Record<string, EventCompletions>;

export type InProgressEntity = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export type InProgressActivity = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export type InProgressFlow = {
  flowId: string;
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  pipelineActivityOrder: number;
};

export type MultiInformantPayload = Required<MultiInformantState>;
