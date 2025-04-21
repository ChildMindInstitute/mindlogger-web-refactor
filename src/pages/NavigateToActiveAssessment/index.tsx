import { Navigate } from 'react-router-dom';

import { ActivityPipelineType, getDataFromProgressId } from '~/abstract/lib';
import { useActiveAssessment } from '~/entities/applet/model/hooks';
import { selectGroupProgress } from '~/entities/applet/model/selectors';
import ROUTES from '~/shared/constants/routes';
import { useAppSelector } from '~/shared/utils';

const NavigateToActiveAssessment = () => {
  const { activeAssessment } = useActiveAssessment();

  const groupProgress = useAppSelector((state) => {
    if (!activeAssessment?.groupProgressId) return null;

    return selectGroupProgress(state, activeAssessment.groupProgressId);
  });

  if (!activeAssessment || !groupProgress) {
    // Navigate to applets list if no in-progress assessment
    return <Navigate to={ROUTES.appletList.path} />;
  }

  const { entityId, eventId, targetSubjectId } = getDataFromProgressId(
    activeAssessment.groupProgressId,
  );

  const navigateParams = {
    appletId: activeAssessment.appletId,
    activityId:
      groupProgress.type === ActivityPipelineType.Flow ? groupProgress.currentActivityId : entityId,
    entityType: groupProgress.type === ActivityPipelineType.Flow ? 'flow' : 'regular',
    eventId,
    flowId: groupProgress.type === ActivityPipelineType.Flow ? entityId : null,
  } as const;

  const navigateTo = activeAssessment.publicAppletKey
    ? ROUTES.publicSurvey.navigateTo({
        ...navigateParams,
        publicAppletKey: activeAssessment.publicAppletKey,
      })
    : ROUTES.survey.navigateTo({
        ...navigateParams,
        targetSubjectId,
      });

  return <Navigate to={navigateTo} />;
};

export default NavigateToActiveAssessment;
