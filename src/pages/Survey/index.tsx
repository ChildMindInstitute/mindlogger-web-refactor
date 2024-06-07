import { useParams } from 'react-router-dom';

import Box from '~/shared/ui/Box';
import { useCustomTranslation } from '~/shared/utils';
import { SurveyBasicContext, SurveyWidget } from '~/widgets/Survey';

function SurveyPage() {
  const { appletId, activityId, eventId } = useParams();
  const { t } = useCustomTranslation();

  if (!appletId || !activityId || !eventId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <Box display="flex" flex={1}>
      <SurveyBasicContext.Provider value={{ appletId, activityId, eventId, isPublic: false }}>
        <SurveyWidget />
      </SurveyBasicContext.Provider>
    </Box>
  );
}

export default SurveyPage;
