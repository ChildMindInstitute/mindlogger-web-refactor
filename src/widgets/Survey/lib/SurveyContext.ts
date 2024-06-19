import { createContext } from 'react';

import {
  ActivityDTO,
  ActivityFlowDTO,
  AppletDTO,
  RespondentMetaDTO,
  ScheduleEventDto,
} from '~/shared/api';

export type SurveyContext = {
  activity: ActivityDTO;
  respondentMeta?: RespondentMetaDTO;

  event: ScheduleEventDto;

  appletId: string;
  encryption: AppletDTO['encryption'];
  appletVersion: string;

  watermark: string;
  flow: ActivityFlowDTO | null;

  integrations: AppletDTO['integrations'];
};

export const SurveyContext = createContext<SurveyContext>({} as SurveyContext);
