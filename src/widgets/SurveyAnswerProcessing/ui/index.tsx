import { ProcessingScreen } from './ProcessingScreen';

import {
  SurveyContext,
  mapRawDataToSurveyContext,
  useSurveyDataQuery,
} from '~/features/PassSurvey';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;

  flowId: string | null;
  publicAppletKey: string | null;
};

function SurveyAnswerProcessingWidget(props: Props) {
  const { appletDTO, activityDTO, eventsDTO, isLoading, isError, error, respondentMeta } =
    useSurveyDataQuery({
      appletId: props.appletId,
      activityId: props.activityId,
      publicAppletKey: props.publicAppletKey,
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <SurveyContext.Provider
      value={mapRawDataToSurveyContext({
        appletDTO,
        activityDTO,
        eventsDTO,
        currentEventId: props.eventId,
        flowId: props.flowId,
        publicAppletKey: props.publicAppletKey,
        respondentMeta,
      })}
    >
      <ProcessingScreen />
    </SurveyContext.Provider>
  );
}

export default SurveyAnswerProcessingWidget;
