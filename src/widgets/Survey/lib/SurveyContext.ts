import { createContext } from 'react';

import { ActivityDTO, AppletDTO, RespondentMetaDTO, ScheduleEventDto } from '~/shared/api';

export type SurveyContext = {
  activity: ActivityDTO;
  respondentMeta?: RespondentMetaDTO;

  event: ScheduleEventDto;

  // Vital Applet Details
  appletId: string;
  encryption: AppletDTO['encryption'];
  appletVersion: string;

  watermark: string;
  flows: AppletDTO['activityFlows'];

  integrations: AppletDTO['integrations'];
};

export const SurveyContext = createContext<SurveyContext>({} as SurveyContext);
