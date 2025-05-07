import { Navigate } from 'react-router-dom';

import { ActivityPipelineType, getDataFromProgressId, getProgressId } from '~/abstract/lib';
import { RequestHealthRecordDataItemStep } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { actions } from '~/entities/applet/model';
import { useActiveAssessment } from '~/entities/applet/model/hooks';
import { selectGroupProgress } from '~/entities/applet/model/selectors';
import ROUTES from '~/shared/constants/routes';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

const NavigateToActiveAssessment = () => {
  const dispatch = useAppDispatch();
  const { activeAssessment } = useActiveAssessment();

  const groupProgress = useAppSelector((state) => {
    if (!activeAssessment?.groupProgressId) return null;
    return selectGroupProgress(state, activeAssessment.groupProgressId);
  });

  const progressData = activeAssessment?.groupProgressId
    ? getDataFromProgressId(activeAssessment.groupProgressId)
    : null;

  const activityId =
    groupProgress &&
    progressData &&
    (groupProgress.type === ActivityPipelineType.Flow
      ? groupProgress.currentActivityId
      : progressData.entityId);

  const activityProgress = useAppSelector((state) => {
    if (!activityId) return null;

    return appletModel.selectors.selectActivityProgress(
      state,
      getProgressId(activityId, progressData.eventId, progressData.targetSubjectId),
    );
  });

  /* No active assessment found, navigate to applet list
  =================================================== */
  if (!activeAssessment || !activityId) {
    return <Navigate to={ROUTES.appletList.path} />;
  }

  /* Specific handling of activities containing EHR item types:
   *
   * When the activity contains an EHR item type that's in the OneUpHealth step, and we're resuming
   * the activity via the /active-assessment route, advance the item's state to the last sub-step
   * (after the OneUpHealth step). Also reset the additional EHRs request to unanswered.
   =================================================== */
  const ehrItemIndex =
    activityProgress?.items.findIndex((item) => item.responseType === 'requestHealthRecordData') ??
    -1;
  const ehrItem = ehrItemIndex >= 0 ? activityProgress?.items[ehrItemIndex] : null;

  if (
    ehrItem &&
    activityProgress?.step === ehrItemIndex &&
    ehrItem.subStep === RequestHealthRecordDataItemStep.OneUpHealth
  ) {
    dispatch(
      actions.saveCustomProperty({
        entityId: activityId,
        eventId: progressData.eventId,
        targetSubjectId: progressData.targetSubjectId,
        itemId: ehrItem.id,
        customProperty: 'subStep',
        value: RequestHealthRecordDataItemStep.AdditionalPrompt,
      }),
    );
    dispatch(
      actions.saveCustomProperty({
        entityId: activityId,
        eventId: progressData.eventId,
        targetSubjectId: progressData.targetSubjectId,
        itemId: ehrItem.id,
        customProperty: 'additionalEHRs',
        value: null,
      }),
    );
  }

  /* Navigate to active assessment
  =================================================== */
  const navigateParams = {
    appletId: activeAssessment.appletId,
    activityId,
    entityType: groupProgress.type === ActivityPipelineType.Flow ? 'flow' : 'regular',
    eventId: progressData.eventId,
    flowId: groupProgress.type === ActivityPipelineType.Flow ? progressData.entityId : null,
  } as const;

  const navigateTo = activeAssessment.publicAppletKey
    ? ROUTES.publicSurvey.navigateTo({
        ...navigateParams,
        publicAppletKey: activeAssessment.publicAppletKey,
      })
    : ROUTES.survey.navigateTo({
        ...navigateParams,
        targetSubjectId: progressData.targetSubjectId,
      });

  return <Navigate to={navigateTo} />;
};

export default NavigateToActiveAssessment;
