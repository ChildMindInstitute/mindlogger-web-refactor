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
  targetSubjectId: string | null;

  flowId: string | null;
  publicAppletKey: string | null;
};

function SurveyAutoCompletionWidget(props: Props) {
  const {
    appletDTO,
    appletBaseDTO,
    respondentMeta,
    activityDTO,
    eventsDTO,
    targetSubject,
    isError,
    isLoading,
    error,
  } = useSurveyDataQuery({
    appletId: props.appletId,
    activityId: props.activityId,
    publicAppletKey: props.publicAppletKey,
    targetSubjectId: props.targetSubjectId,
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
        appletBaseDTO,
        activityDTO,
        eventsDTO,
        currentEventId: props.eventId,
        flowId: props.flowId,
        targetSubject,
        publicAppletKey: props.publicAppletKey,
        respondentMeta,
      })}
    >
      <AutoCompletionScreen />
    </SurveyContext.Provider>
  );
}

export default SurveyAutoCompletionWidget;
