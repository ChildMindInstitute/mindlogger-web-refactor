import { useParams, useSearchParams } from 'react-router-dom';

import Box from '~/shared/ui/Box';
import { useCustomTranslation } from '~/shared/utils';
import { SurveyWidget } from '~/widgets/Survey';

function SurveyPage() {
  const { t } = useCustomTranslation();

  const { appletId, activityId, eventId, entityType } = useParams();

  const [searchParams] = useSearchParams();

  const isFlow = entityType === 'flow';
  const flowId = isFlow ? searchParams.get('flowId') : null;
  const targetSubjectId = searchParams.get('targetSubjectId');

  if (!appletId || !activityId || !eventId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <Box display="flex" flex={1}>
      <SurveyWidget
        appletId={appletId}
        activityId={activityId}
        eventId={eventId}
        flowId={flowId}
        targetSubjectId={targetSubjectId}
        publicAppletKey={null}
      />
    </Box>
  );
}

export default SurveyPage;
