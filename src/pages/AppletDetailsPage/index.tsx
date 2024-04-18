import { useLocation, useParams } from 'react-router-dom';

import ValidateTakeNowParams from '~/features/TakeNow/ui/ValidateTakeNowParams';
import { useCustomTranslation } from '~/shared/utils';
import { ActivityGroups } from '~/widgets/ActivityGroups';
import { AuthorizationGuard } from '~/widgets/AuthorizationGuard';
import { LoginWithRedirect } from '~/widgets/LoginWithRedirect';

function AppletDetailsPage() {
  const { appletId } = useParams();
  const location = useLocation();
  const { t } = useCustomTranslation();

  const queryParams = new URLSearchParams(location.search);
  const startActivityOrFlow = queryParams.get('startActivityOrFlow');
  const subjectId = queryParams.get('subjectId');
  const respondentId = queryParams.get('respondentId');

  if (!appletId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  if (!startActivityOrFlow || !subjectId || !respondentId) {
    return (
      <AuthorizationGuard fallback={<LoginWithRedirect />}>
        <ActivityGroups isPublic={false} appletId={appletId} />
      </AuthorizationGuard>
    );
  }

  return (
    <AuthorizationGuard fallback={<LoginWithRedirect />}>
      <ValidateTakeNowParams
        appletId={appletId}
        startActivityOrFlow={startActivityOrFlow}
        subjectId={subjectId}
        respondentId={respondentId}
      />
    </AuthorizationGuard>
  );
}

export default AppletDetailsPage;
