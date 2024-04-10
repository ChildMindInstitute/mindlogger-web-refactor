import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';

import { useCustomTranslation } from '~/shared/utils';
import { ActivityDetailsContext, ActivityDetailsWidget } from '~/widgets/ActivityDetails';
import { AuthorizationGuard } from '~/widgets/AuthorizationGuard';
import { LoginWithRedirect } from '~/widgets/LoginWithRedirect';

function ActivityDetailsPage() {
  const { appletId, activityId, eventId } = useParams();
  const { t } = useCustomTranslation();

  if (!appletId || !activityId || !eventId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <AuthorizationGuard fallback={<LoginWithRedirect />}>
      <Box display="flex" flex={1}>
        <ActivityDetailsContext.Provider value={{ appletId, activityId, eventId, isPublic: false }}>
          <ActivityDetailsWidget />
        </ActivityDetailsContext.Provider>
      </Box>
    </AuthorizationGuard>
  );
}

export default ActivityDetailsPage;
