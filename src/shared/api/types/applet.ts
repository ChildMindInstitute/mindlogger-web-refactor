import { BaseSuccessListResponse, BaseSuccessResponse } from './base';
import { PeriodicityTypeDTO } from './events';
import { ItemResponseTypeDTO } from './item';
import { HourMinute } from '../../utils';

// API payloads
export type GetAppletByIdPayload = {
  appletId: string;
};

export type GetPublicAppletByIdPayload = {
  publicAppletKey: string;
};

export type GetPublicAppletActivityByIdPayload = {
  publicAppletKey: string;
  activityId: string;
};

export type RespondentMetaDTO = {
  subjectId: string | null;
  nickname: string | null;
  tag: string | null;
};

// API Responses - Success
export type AppletListSuccessResponse = BaseSuccessListResponse<AppletListDTO>;
export type AppletSuccessResponse = BaseSuccessResponse<AppletDTO> & {
  respondentMeta: RespondentMetaDTO;
};

export type AppletDetailsBaseInfoSuccess = BaseSuccessResponse<AppletBaseDTO>;

export type AppletListDTO = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string;
  watermark: string;
};

export type AppletDTO = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string;
  watermark: string;
  ownerId: string;
  activities: AppletDetailsActivityDTO[];
  activityFlows: ActivityFlowDTO[];
  encryption: EncryptionDTO | null;
  integrations?: Integration[] | null;
};

export type AppletBaseDTO = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string;
  watermark: string;
  createdAt: string;
  updatedAt: string;
  activities: Array<ActivityBaseDTO>;
  activityFlows: Array<ActivityFlowDTO>;
  encryption: EncryptionDTO | null;
  integrations?: Integration[];
  respondentMeta?: RespondentMetaDTO;
};

export type ActivityBaseDTO = {
  id: string;
  name: string;
  description: string;
  image: string;
  isHidden: boolean;
  order: number;
  containsResponseTypes: Array<ItemResponseTypeDTO>;
  itemCount: number;
  autoAssign: boolean;
};

type Integration = 'loris';

export type AppletDetailsActivityDTO = {
  id: string;
  name: string;
  description: string;
  splashScreen: string;
  image: string;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  isHidden: boolean;
  responseIsEditable: boolean;
  order: number;
};

export type ActivityFlowDTO = {
  id: string;
  name: string;
  description: string;
  image: string;
  isSingleReport: boolean;
  hideBadge: boolean;
  order: number;
  isHidden: boolean;
  activityIds: Array<string>;
  autoAssign: boolean;
};

export type EventAvailabilityDto = {
  oneTimeCompletion: boolean;
  periodicityType: PeriodicityTypeDTO;
  timeFrom: HourMinute | null;
  timeTo: HourMinute | null;
  allowAccessBeforeFromTime: boolean;
  startDate?: string | null;
  endDate?: string | null;
};

export type ScheduleEventDto = {
  id: string;
  entityId: string;
  availabilityType: string;
  availability: EventAvailabilityDto;
  selectedDate: string | null;
  timers: {
    timer: HourMinute | null;
    idleTimer: HourMinute | null;
  };
};

export type AppletEventsResponse = {
  events: ScheduleEventDto[];
};

export type AllUserEventsDTO = {
  appletId: string;
  events: ScheduleEventDto[];
};

export type EncryptionDTO = {
  accountId: string;
  base: string; // Contains number[]
  prime: string; // Contains number[]
  publicKey: string; // Contains number[]
};
