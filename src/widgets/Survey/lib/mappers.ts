import { SurveyContext } from './SurveyContext';

import { ActivityDTO, AppletDTO, AppletEventsResponse, RespondentMetaDTO } from '~/shared/api';

type Props = {
  appletDTO: AppletDTO | null;
  eventsDTO: AppletEventsResponse | null;
  respondentMeta?: RespondentMetaDTO;
  activityDTO: ActivityDTO | null;

  currentEventId: string;
};

export const mapRawDataToSurveyContext = (props: Props): SurveyContext => {
  const { appletDTO, eventsDTO, activityDTO, currentEventId } = props;

  if (!appletDTO || !eventsDTO || !activityDTO) {
    throw new Error('[MapRawDataToSurveyContext] Missing required data');
  }

  const event = eventsDTO.events.find((ev) => ev.id === currentEventId);

  if (!event) {
    throw new Error('[MapRawDataToSurveyContext] Event not found');
  }

  return {
    activity: activityDTO,
    applet: appletDTO,
    event,
    respondentMeta: props.respondentMeta,
  };
};
