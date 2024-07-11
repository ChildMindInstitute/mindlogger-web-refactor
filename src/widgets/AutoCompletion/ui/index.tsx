import { AutoCompletionScreen } from './AutoCompletionScreen';

import {
  SurveyContext,
  mapRawDataToSurveyContext,
  useSurveyDataQuery,
} from '~/features/PassSurvey';
import Loader from '~/shared/ui/Loader';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;

  flowId: string | null;
  publicAppletKey: string | null;
};

function SurveyAutoCompletionWidget(props: Props) {
  const { appletDTO, activityDTO, eventsDTO, isLoading, isError, error, respondentMeta } =
    useSurveyDataQuery({
      appletId: props.appletId,
      activityId: props.activityId,
      publicAppletKey: props.publicAppletKey,
    });

  if (isLoading) {
    return <Loader />;
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
      <AutoCompletionScreen />
    </SurveyContext.Provider>
  );
}

export default SurveyAutoCompletionWidget;
