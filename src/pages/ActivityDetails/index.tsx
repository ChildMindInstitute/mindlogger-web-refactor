import { useParams } from 'react-router-dom';

import { Box } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';
import { ActivityDetailsContext, ActivityDetailsWidget } from '~/widgets/ActivityDetails';

function ActivityDetailsPage() {
  const { appletId, activityId, eventId } = useParams();
  const { t } = useCustomTranslation();

  if (!appletId || !activityId || !eventId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <Box display="flex" flex={1}>
      <ActivityDetailsContext.Provider value={{ appletId, activityId, eventId, isPublic: false }}>
        <ActivityDetailsWidget />
      </ActivityDetailsContext.Provider>
    </Box>
  );
}

export default ActivityDetailsPage;
