import { useParams, useSearchParams } from 'react-router-dom';

import Box from '~/shared/ui/Box';
import { useCustomTranslation } from '~/shared/utils';
import { SurveyBasicContext, SurveyWidget } from '~/widgets/Survey';

function SurveyPage() {
  const { t } = useCustomTranslation();

  const { appletId, activityId, eventId, entityType } = useParams();

  const [searchParams] = useSearchParams();

  const isFlow = entityType === 'flow';

  let flowId: string | null = null;

  if (isFlow) {
    flowId = searchParams.get('flowId');
  }

  if (!appletId || !activityId || !eventId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <Box display="flex" flex={1}>
      <SurveyBasicContext.Provider
        value={{ appletId, activityId, eventId, flowId, isPublic: false }}
      >
        <SurveyWidget />
      </SurveyBasicContext.Provider>
    </Box>
  );
}

export default SurveyPage;
