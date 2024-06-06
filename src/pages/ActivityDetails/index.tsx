import { useParams } from 'react-router-dom';

import Box from '~/shared/ui/Box';
import { useCustomTranslation } from '~/shared/utils';
import { ActivityDetailsWidget, SurveyBasicContext } from '~/widgets/ActivityDetails';

function ActivityDetailsPage() {
  const { appletId, activityId, eventId } = useParams();
  const { t } = useCustomTranslation();

  if (!appletId || !activityId || !eventId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <Box display="flex" flex={1}>
      <SurveyBasicContext.Provider value={{ appletId, activityId, eventId, isPublic: false }}>
        <ActivityDetailsWidget />
      </SurveyBasicContext.Provider>
    </Box>
  );
}

export default ActivityDetailsPage;
