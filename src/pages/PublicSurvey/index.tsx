import { useParams, useSearchParams } from 'react-router-dom';

import Box from '~/shared/ui/Box';
import { useCustomTranslation } from '~/shared/utils';
import { SurveyWidget } from '~/widgets/Survey';

function PublicSurvey() {
  const { t } = useCustomTranslation();

  const { appletId, activityId, eventId, publicAppletKey, entityType } = useParams();

  const [searchParams] = useSearchParams();

  const isFlow = entityType === 'flow';

  let flowId: string | null = null;

  if (isFlow) {
    flowId = searchParams.get('flowId');
  }

  if (!appletId || !activityId || !eventId || !publicAppletKey) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <Box display="flex" flex={1}>
      <SurveyWidget
        appletId={appletId}
        activityId={activityId}
        eventId={eventId}
        flowId={flowId}
        publicAppletKey={publicAppletKey}
      />
    </Box>
  );
}

export default PublicSurvey;
