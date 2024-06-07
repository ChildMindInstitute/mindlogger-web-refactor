import { useContext } from 'react';

import { AssessmentLoadingScreen } from './AssessmentLoadingScreen';
import { AssessmentPassingScreen } from './AssessmentPassingScreen';
import { AssessmentSummaryScreen } from './AssessmentSummaryScreen';
import { AssessmentWelcomeScreen } from './AssessmentWelcomeScreen';
import { SurveyBasicContext, SurveyContext } from '../lib';
import * as activityDetailsModel from '../model';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import Box from '~/shared/ui/Box';
import { useAppSelector, useCustomTranslation } from '~/shared/utils';

export const SurveyWidget = () => {
  const { t } = useCustomTranslation();

  const context = useContext(SurveyBasicContext);

  const activityEventId = getProgressId(context.activityId, context.eventId);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, activityEventId),
  );

  const items = activityProgress?.items ?? [];

  const showSummaryScreen = activityProgress?.isSummaryScreenOpen ?? false;

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

  if (showSummaryScreen) {
    return (
      <AssessmentSummaryScreen
        appletDetails={appletDetails}
        activityId={activityDetails.id}
        activityName={activityDetails.name}
      />
    );
  }

  return (
    <SurveyContext.Provider
      value={{
        activity: activityDetails,
        applet: appletDetails,
        events: eventsRawData,
        respondentMeta,
      }}
    >
      <AssessmentPassingScreen />
    </SurveyContext.Provider>
  );
};
