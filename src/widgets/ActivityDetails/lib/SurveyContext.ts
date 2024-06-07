import { createContext } from 'react';

import {
  ActivityDTO,
  AppletDetailsDTO,
  AppletEventsResponse,
  RespondentMetaDTO,
} from '~/shared/api';

type Context = {
  activity: ActivityDTO;
  events: AppletEventsResponse;
  applet: AppletDetailsDTO;
  respondentMeta?: RespondentMetaDTO;
};

export const SurveyContext = createContext<Context>({} as Context);
