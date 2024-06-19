import { SurveyContext } from './SurveyContext';

import {
  ActivityDTO,
  ActivityFlowDTO,
  AppletDTO,
  AppletEventsResponse,
  RespondentMetaDTO,
} from '~/shared/api';

type Props = {
  appletDTO: AppletDTO | null;
  eventsDTO: AppletEventsResponse | null;
  respondentMeta?: RespondentMetaDTO;
  activityDTO: ActivityDTO | null;

  currentEventId: string;
  flowId: string | null;
};

export const mapRawDataToSurveyContext = (props: Props): SurveyContext => {
  const { appletDTO, eventsDTO, activityDTO, currentEventId, flowId } = props;

  if (!appletDTO || !eventsDTO || !activityDTO) {
    throw new Error('[MapRawDataToSurveyContext] Missing required data');
  }

  const event = eventsDTO.events.find((ev) => ev.id === currentEventId);

  if (!event) {
    throw new Error('[MapRawDataToSurveyContext] Event not found');
  }

  let flow: ActivityFlowDTO | null = null;

  if (flowId) {
    flow = appletDTO.activityFlows.find((f) => f.id === flowId) ?? null;
  }

  return {
    activity: activityDTO,
    event,
    respondentMeta: props.respondentMeta,

    appletId: appletDTO.id,
    encryption: appletDTO.encryption,
    appletVersion: appletDTO.version,
    flow,
    watermark: appletDTO.watermark,
    integrations: appletDTO.integrations,
  };
};
