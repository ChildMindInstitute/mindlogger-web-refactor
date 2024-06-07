import { useContext } from 'react';

import LoadingScreen from './LoadingScreen';
import PassingScreen from './PassingScreen';
import SummaryScreen from './SummaryScreen';
import WelcomeScreen from './WelcomeScreen';
import { SurveyBasicContext, SurveyContext } from '../lib';
import { useSurveyDataQuery } from '../model/hooks';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import Box from '~/shared/ui/Box';
import { useAppSelector, useCustomTranslation } from '~/shared/utils';

export const SurveyWidget = () => {
  const { t } = useCustomTranslation();

  const context = useContext(SurveyBasicContext);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(
      state,
      getProgressId(context.activityId, context.eventId),
    ),
  );

  const items = activityProgress?.items ?? [];

  const showSummaryScreen = activityProgress?.isSummaryScreenOpen ?? false;

  const isActivityStarted = items.length > 0;

  const { activityDTO, appletDTO, eventsDTO, respondentMeta, isLoading, isError, error } =
    useSurveyDataQuery();

  if (isLoading) {
    return <LoadingScreen />;
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

  if (!appletDTO || !activityDTO || !eventsDTO) {
    return (
      <Box height="100vh" width="100%" display="flex" justifyContent="center" alignItems="center">
        <span>{t('common_loading_error')}</span>
      </Box>
    );
  }

  if (!isActivityStarted) {
    return <WelcomeScreen activityDetails={activityDTO} />;
  }

  if (showSummaryScreen) {
    return <SummaryScreen appletDetails={appletDTO} activityName={activityDTO.name} />;
  }

  return (
    <SurveyContext.Provider
      value={{
        activity: activityDTO,
        applet: appletDTO,
        events: eventsDTO,
        respondentMeta,
      }}
    >
      <PassingScreen />
    </SurveyContext.Provider>
  );
};
