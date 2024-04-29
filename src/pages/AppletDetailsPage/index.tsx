import { useLocation, useParams } from 'react-router-dom';

import { useCustomTranslation } from '~/shared/utils';
import { ActivityGroups } from '~/widgets/ActivityGroups';
import { AuthorizationGuard } from '~/widgets/AuthorizationGuard';
import { LoginWithRedirect } from '~/widgets/LoginWithRedirect';

function AppletDetailsPage() {
  const { appletId } = useParams();
  const location = useLocation();
  const { t } = useCustomTranslation();

  if (!appletId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  const queryParams = new URLSearchParams(location.search);

  return (
    <AuthorizationGuard fallback={<LoginWithRedirect />}>
      <ActivityGroups
        isPublic={false}
        appletId={appletId}
        startActivityOrFlow={queryParams.get('startActivityOrFlow')}
      />
    </AuthorizationGuard>
  );
}

export default AppletDetailsPage;
