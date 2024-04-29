import { BaseSuccessResponse } from './base';
import {
  AudioPlayerItemDTO,
  CheckboxItemDTO,
  DateItemDTO,
  MessageItemDTO,
  MultiSelectionRowsItemDTO,
  RadioItemDTO,
  SelectorItemDTO,
  SingleSelectionRowsItemDTO,
  SliderItemDTO,
  SliderRowsItemDTO,
  TextItemDTO,
  TimeItemDTO,
  TimeRangeItemDTO,
} from './item';

export type ID = string;

export interface GetActivityByIdPayload {
  activityId: ID;
}

export type GetPublicActivityById = {
  activityId: ID;
};

export interface GetCompletedEntitiesPayload {
  appletId: ID;
  version: string;
  fromDate: string; // example: 2022-01-01
}

export type SuccessResponseActivityById = BaseSuccessResponse<ActivityDTO>;

export type ActivityDTO = {
  id: ID;
  createdAt: string;
  name: string;
  description: string;
  splashScreen: string;
  image: string;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  responseIsEditable: boolean;
  isHidden: boolean;
  order: number;
  items: ActivityItemDetailsDTO[];
};

export type ActivityItemDetailsDTO =
  | TextItemDTO
  | CheckboxItemDTO
  | RadioItemDTO
  | SliderItemDTO
  | SelectorItemDTO
  | MessageItemDTO
  | DateItemDTO
  | TimeItemDTO
  | TimeRangeItemDTO
  | AudioPlayerItemDTO
  | MultiSelectionRowsItemDTO
  | SingleSelectionRowsItemDTO
  | SliderRowsItemDTO;

export type AnswerPayload = {
  appletId: ID;
  version: string;
  createdAt: number;
  submitId: ID;
  flowId: ID | null;
  activityId: ID;
  alerts: Array<AlertDTO>;
  isFlowCompleted: boolean;
  client: {
    appId: 'mindlogger-web';
    appVersion: string;
    width: number;
    height: number;
  };
  answer: {
    answer: string; // Encrypted answer DTO: Array<string | { value: string | string[] | number, text: string | null }>
    events: string; // Encrypted user actions DTO
    itemIds: Array<ID>;
    identifier: string | null;
    scheduledTime?: number;
    startTime: number;
    endTime: number;
    userPublicKey: string;
    scheduledEventId: string;
    localEndDate: string;
    localEndTime: string;
  };
};

export type AlertDTO = {
  activityItemId: string;
  message: string;
};

export type AnswerTypesPayload =
  | EmptyAnswerPayload
  | TextAnswerPayload
  | MultiSelectAnswerPayload
  | SingleSelectAnswerPayload
  | SliderAnswerPayload
  | NumberSelectAnswerPayload
  | DateAnswerPayload
  | TimeAnswerPayload
  | TimeRangeAnswerPayload
  | AudioPlayerAnswerPayload
  | MatrixMultiSelectAnswerPayload;

export type EmptyAnswerPayload = null;

export type TextAnswerPayload = string;

export type MultiSelectAnswerPayload = {
  value: Array<number>;
  text: string | null;
};

export type SingleSelectAnswerPayload = {
  value: number;
  text: string | null;
};

export type SliderAnswerPayload = {
  value: number;
  text: string | null;
};

export type NumberSelectAnswerPayload = {
  value: number;
  text: string | null;
};

export type MessageAnswerPayload = null;

export type DateAnswerPayload = {
  value: {
    day: number;
    month: number;
    year: number;
  };
  text: string | null;
};

export type TimeAnswerPayload = {
  value: { hours: number; minutes: number };
  text: string | null;
};

export type TimeRangeAnswerPayload = {
  value: {
    from: {
      hour: number;
      minute: number;
    };
    to: {
      hour: number;
      minute: number;
    };
  };
  text: string | null;
};

export type AudioPlayerAnswerPayload = {
  value: boolean;
  text: string | null;
};

export type MultiSelectMatrixAnswerPayload = {
  value: Array<Array<string>>;
  text: string | null;
};

export type SingleSelectMatrixAnswerPayload = {
  value: Array<string>;
  text: string | null;
};

export type MatrixMultiSelectAnswerPayload = {
  value: Array<Array<string | null>>;
  text: string | null;
};

export type CompletedEntityDTO = {
  id: string;
  answerId: string;
  submitId: string;
  scheduledEventId: string;
  localEndDate: string;
  localEndTime: string;
};

export type CompletedEntitiesDTO = {
  id: string;
  version: string;
  activities: Array<CompletedEntityDTO>;
  activityFlows: Array<CompletedEntityDTO>;
};

export type CompletedEntitiesDTOSuccessResponse = BaseSuccessResponse<CompletedEntitiesDTO>;
