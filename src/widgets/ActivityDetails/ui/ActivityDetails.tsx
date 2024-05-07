import { useContext } from 'react';

import { AssessmentLoadingScreen } from './AssessmentLoadingScreen';
import { AssessmentPassingScreen } from './AssessmentPassingScreen';
import { AssessmentWelcomeScreen } from './AssessmentWelcomeScreen';
import { ActivityDetailsContext } from '../lib';
import * as activityDetailsModel from '../model';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { Box } from '~/shared/ui';
import { useAppSelector, useCustomTranslation } from '~/shared/utils';

export const ActivityDetailsWidget = () => {
  const { t } = useCustomTranslation();

  const context = useContext(ActivityDetailsContext);

  const activityEventId = getProgressId(context.activityId, context.eventId);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, activityEventId),
  );

  const items = activityProgress?.items ?? [];

  const isActivityStarted = items.length > 0;

  const {
    activityDetails,
    isLoading,
    isError,
    error,
    appletDetails,
    eventsRawData,
    respondentMeta,
  } = activityDetailsModel.hooks.useActivityDetailsQuery();

  if (isLoading) {
    return <AssessmentLoadingScreen />;
  }

  if (isError) {
    return (
      <Box height="100vh" width="100%" display="flex" justifyContent="center" alignItems="center">
        <span>
          {context.isPublic ? t('additional.invalid_public_url') : error?.evaluatedMessage}
        </span>
      </Box>
    );
  }

  if (!appletDetails || !activityDetails || !eventsRawData) {
    return (
      <Box height="100vh" width="100%" display="flex" justifyContent="center" alignItems="center">
        <span>{t('common_loading_error')}</span>
      </Box>
    );
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
