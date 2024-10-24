import { SurveyContext } from './SurveyContext';

import {
  ActivityDTO,
  ActivityFlowDTO,
  AppletBaseDTO,
  AppletDTO,
  AppletEventsResponse,
  RespondentMetaDTO,
} from '~/shared/api';
import { SubjectDTO } from '~/shared/api/types/subject';

type Props = {
  appletDTO: AppletDTO | null;
  appletBaseDTO: AppletBaseDTO | null;
  eventsDTO: AppletEventsResponse | null;
  respondentMeta?: RespondentMetaDTO;
  activityDTO: ActivityDTO | null;
  targetSubject: SubjectDTO | null;

  currentEventId: string;
  flowId: string | null;
  publicAppletKey: string | null;
};

export const mapRawDataToSurveyContext = ({
  appletDTO,
  appletBaseDTO,
  eventsDTO,
  activityDTO,
  currentEventId,
  flowId,
  publicAppletKey,
  targetSubject,
  respondentMeta,
}: Props): SurveyContext => {
  if (!appletDTO || !appletBaseDTO || !eventsDTO || !activityDTO) {
    throw new Error('[MapRawDataToSurveyContext] Missing required data');
  }

  const event = eventsDTO.events.find((ev) => ev.id === currentEventId);

  if (!event) {
    throw new Error('[MapRawDataToSurveyContext] Event not found');
  }

  let flow: ActivityFlowDTO | null = null;

  if (flowId) {
    flow = appletBaseDTO.activityFlows.find((f) => f.id === flowId) ?? null;
  }

  return {
    applet: appletBaseDTO,
    appletId: appletDTO.id,
    appletDisplayName: appletDTO.displayName,
    watermark: appletDTO.watermark,

    activityId: activityDTO.id,
    eventId: currentEventId,

    entityId: flowId ?? activityDTO.id,

    publicAppletKey,

    activity: activityDTO,
    event,
    targetSubject,
    respondentMeta,

    encryption: appletDTO.encryption,
    appletVersion: appletDTO.version,
    flow,
    integrations: appletDTO.integrations,
  };
};
