import { createContext } from 'react';

import { ActivityDTO, AppletDTO, AppletEventsResponse, RespondentMetaDTO } from '~/shared/api';

type Context = {
  activity: ActivityDTO;
  events: AppletEventsResponse;
  applet: AppletDTO;
  respondentMeta?: RespondentMetaDTO;
};

export const SurveyContext = createContext<Context>({} as Context);
