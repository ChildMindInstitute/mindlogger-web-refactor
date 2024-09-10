import { useSearchParams } from 'react-router-dom';

import { AutoCompletionWidget } from '~/widgets/AutoCompletion';

function AutoCompletion() {
  const [searchParams] = useSearchParams();

  const appletId = searchParams.get('appletId');
  const activityId = searchParams.get('activityId');
  const eventId = searchParams.get('eventId');
  const flowId = searchParams.get('flowId');
  const targetSubjectId = searchParams.get('targetSubjectId');

  if (!appletId || !activityId || !eventId) {
    return <div>Invalid URL</div>;
  }

  return (
    <AutoCompletionWidget
      appletId={appletId}
      activityId={activityId}
      eventId={eventId}
      flowId={flowId}
      targetSubjectId={targetSubjectId}
      publicAppletKey={null}
    />
  );
}

export default AutoCompletion;
