import { createContext } from 'react';

import {
  ActivityDTO,
  ActivityFlowDTO,
  AppletDTO,
  RespondentMetaDTO,
  ScheduleEventDto,
} from '~/shared/api';

export type SurveyContext = {
  appletId: string;
  appletVersion: string;
  watermark: string;

  activityId: string;
  eventId: string;

  entityId: string;

  publicAppletKey: string | null; // PublicAppletKey used for public applets. When user account not required

  activity: ActivityDTO;

  respondentMeta?: RespondentMetaDTO;

  event: ScheduleEventDto;

  encryption: AppletDTO['encryption'];

  flow: ActivityFlowDTO | null;

  integrations: AppletDTO['integrations'];
};

export const SurveyContext = createContext<SurveyContext>({} as SurveyContext);
