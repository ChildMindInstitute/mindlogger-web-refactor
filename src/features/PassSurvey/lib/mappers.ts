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
  shouldRestart?: boolean;
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
  shouldRestart,
}: Props): SurveyContext => {
  if (!appletDTO || !appletBaseDTO || !eventsDTO || !activityDTO) {
    throw new Error('[MapRawDataToSurveyContext] Missing required data');
  }

  let event = eventsDTO.events.find((ev) => ev.id === currentEventId);

  if (!event) {
    if (flowId) {
      // The flow was deleted from the current applet version but in-progress
      // data still exists. Create a minimal synthetic event so the survey can
      // render and the user can complete / submit the remaining activities.
      // The real timer settings are stored in groupProgress.event by the sync
      // layer, so this placeholder only needs to satisfy the type contract.
      event = {
        id: currentEventId,
        entityId: flowId,
        availabilityType: 'AlwaysAvailable',
        availability: {
          oneTimeCompletion: false,
          periodicityType: 'ALWAYS',
          timeFrom: null,
          timeTo: null,
          allowAccessBeforeFromTime: false,
          startDate: null,
          endDate: null,
        },
        selectedDate: null,
        timers: { timer: null, idleTimer: null },
      };
    } else {
      throw new Error('[MapRawDataToSurveyContext] Event not found');
    }
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
    shouldRestart,
  };
};
