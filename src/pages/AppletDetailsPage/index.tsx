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
  const targetSubjectId = queryParams.get('targetSubjectId');
  const sourceSubjectId = queryParams.get('sourceSubjectId');
  const respondentId = queryParams.get('respondentId');
  const multiInformantAssessmentId = queryParams.get('multiInformantAssessmentId');

  if (!appletId) {
    return <div>{t('wrondLinkParametrError')}</div>;
  }

  if (!startActivityOrFlow || !sourceSubjectId || !targetSubjectId || !respondentId) {
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
        targetSubjectId={targetSubjectId}
        sourceSubjectId={sourceSubjectId}
        respondentId={respondentId}
        multiInformantAssessmentId={multiInformantAssessmentId}
      />
    </AuthorizationGuard>
  );
}

export default AppletDetailsPage;
