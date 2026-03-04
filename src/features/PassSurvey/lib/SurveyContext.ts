import { createContext } from 'react';

import {
  ActivityDTO,
  ActivityFlowDTO,
  AppletBaseDTO,
  AppletDTO,
  RespondentMetaDTO,
  ScheduleEventDto,
} from '~/shared/api';
import { SubjectDTO } from '~/shared/api/types/subject';

export type SurveyContext = {
  applet: AppletBaseDTO;
  appletId: string;
  appletDisplayName: string;
  appletVersion: string;
  watermark: string;

  activityId: string;
  eventId: string;
  targetSubject: SubjectDTO | null;

  entityId: string;

  publicAppletKey: string | null; // PublicAppletKey used for public applets. When user account not required

  activity: ActivityDTO;

  respondentMeta?: RespondentMetaDTO;

  event: ScheduleEventDto;

  encryption: AppletDTO['encryption'];

  flow: ActivityFlowDTO | null;

  integrations: AppletDTO['integrations'];

  shouldRestart?: boolean; // Flag to indicate if the flow was restarted, used to skip sync during session
};

export const SurveyContext = createContext<SurveyContext>({} as SurveyContext);
