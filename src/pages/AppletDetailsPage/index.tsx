import { useParams } from 'react-router-dom';

import { useCustomTranslation } from '~/shared/utils';
import { ActivityGroups } from '~/widgets/ActivityGroups';

function AppletDetailsPage() {
  const { appletId } = useParams();
  const { t } = useCustomTranslation();

  if (!appletId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  return <ActivityGroups isPublic={false} appletId={appletId} />;
}

export default AppletDetailsPage;
