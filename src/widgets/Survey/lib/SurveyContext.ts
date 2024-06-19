import { createContext } from 'react';

import { ActivityDTO, AppletDTO, RespondentMetaDTO, ScheduleEventDto } from '~/shared/api';

export type SurveyContext = {
  activity: ActivityDTO;
  applet: AppletDTO;
  respondentMeta?: RespondentMetaDTO;

  event: ScheduleEventDto;
};

export const SurveyContext = createContext<SurveyContext>({} as SurveyContext);
