import { useParams } from 'react-router-dom';

import Box from '~/shared/ui/Box';
import { useCustomTranslation } from '~/shared/utils';
import { SurveyBasicContext, SurveyWidget } from '~/widgets/Survey';

function PublicActivityDetailsPage() {
  const { appletId, activityId, eventId, publicAppletKey } = useParams();
  const { t } = useCustomTranslation();

  if (!appletId || !activityId || !eventId || !publicAppletKey) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <Box display="flex" flex={1}>
      <SurveyBasicContext.Provider
        value={{ appletId, activityId, eventId, publicAppletKey, isPublic: true }}
      >
        <SurveyWidget />
      </SurveyBasicContext.Provider>
    </Box>
  );
}

export default PublicActivityDetailsPage;
