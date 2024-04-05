import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { AssessmentLoadingScreen } from './AssessmentLoadingScreen';
import { AssessmentPassingScreen } from './AssessmentPassingScreen';
import { AssessmentWelcomeScreen } from './AssessmentWelcomeScreen';
import { ActivityDetailsContext } from '../lib';
import * as activityDetailsModel from '../model';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { ROUTES } from '~/shared/constants';
import { useNotification } from '~/shared/ui';
import { useAppSelector, useCustomTranslation } from '~/shared/utils';

export const ActivityDetailsWidget = () => {
  const { t } = useCustomTranslation();
  const { showErrorNotification } = useNotification();
  const navigate = useNavigate();

  const context = useContext(ActivityDetailsContext);

  const activityEventId = getProgressId(context.activityId, context.eventId);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, activityEventId),
  );

  const items = activityProgress?.items ?? [];

  const isActivityStarted = items.length > 0;

  const { activityDetails, isLoading, isError, appletDetails, eventsRawData, respondentMeta } =
    activityDetailsModel.hooks.useActivityDetailsQuery();

  if (isLoading) {
    return <AssessmentLoadingScreen />;
  }

  if (!appletDetails || !activityDetails || !eventsRawData || isError) {
    setTimeout(() => {
      showErrorNotification(t('unabletoLoadActivity'));
    });

    navigate(ROUTES.appletList.path);

    return <></>;
  }

  if (!isActivityStarted) {
    return <AssessmentWelcomeScreen activityDetails={activityDetails} />;
  }

  return (
    <AssessmentPassingScreen
      appletDetails={appletDetails}
      activityDetails={activityDetails}
      eventsRawData={eventsRawData}
      respondentMeta={respondentMeta}
    />
  );
};
