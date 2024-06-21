import { useSearchParams } from 'react-router-dom';

import SurveyAnswerProcessingWidget from '~/widgets/SurveyAnswerProcessing';

function PublicSurveyAnswerProcessing() {
  const [searchParams] = useSearchParams();

  const appletId = searchParams.get('appletId');
  const activityId = searchParams.get('activityId');
  const eventId = searchParams.get('eventId');
  const flowId = searchParams.get('flowId');
  const publicAppletKey = searchParams.get('publicAppletKey');

  if (!appletId || !activityId || !eventId) {
    return <div>Invalid URL</div>;
  }

  return (
    <SurveyAnswerProcessingWidget
      appletId={appletId}
      activityId={activityId}
      eventId={eventId}
      flowId={flowId}
      publicAppletKey={publicAppletKey}
    />
  );
}

export default PublicSurveyAnswerProcessing;
