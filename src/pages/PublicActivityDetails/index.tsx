import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';

import { useCustomTranslation } from '~/shared/utils';
import { ActivityDetailsContext, ActivityDetailsWidget } from '~/widgets/ActivityDetails';

function PublicActivityDetailsPage() {
  const { appletId, activityId, eventId, publicAppletKey } = useParams();
  const { t } = useCustomTranslation();

  if (!appletId || !activityId || !eventId || !publicAppletKey) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return (
    <Box display="flex" flex={1}>
      <ActivityDetailsContext.Provider
        value={{ appletId, activityId, eventId, publicAppletKey, isPublic: true }}
      >
        <ActivityDetailsWidget />
      </ActivityDetailsContext.Provider>
    </Box>
  );
}

export default PublicActivityDetailsPage;
