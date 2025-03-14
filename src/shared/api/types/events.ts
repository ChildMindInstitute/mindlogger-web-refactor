import { AllUserEventsDTO, AppletEventsResponse } from './applet';
import { BaseSuccessResponse } from './base';

export type TimerTypeDTO = 'NOT_SET';
export type PeriodicityTypeDTO = 'ONCE' | 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'MONTHLY' | 'ALWAYS';

export type GetEventsByAppletIdPayload = {
  appletId: string;
};

export type GetEventsByPublicAppletKey = {
  publicAppletKey: string;
};

export type SuccessEventsByAppletIdResponse = BaseSuccessResponse<AppletEventsResponse>;
export type SuccessAllUserEventsResponse = BaseSuccessResponse<AllUserEventsDTO[]>;
