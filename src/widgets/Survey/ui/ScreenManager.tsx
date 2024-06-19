import { useContext } from 'react';

import PassingScreen from './PassingScreen';
import SummaryScreen from './SummaryScreen';
import WelcomeScreen from './WelcomeScreen';
import { SurveyContext } from '../lib';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { useAppSelector } from '~/shared/utils';

export const ScreenManager = () => {
  const context = useContext(SurveyContext);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(
      state,
      getProgressId(context.activityId, context.eventId),
    ),
  );

  const items = activityProgress?.items ?? [];

  const isActivityStarted = items.length > 0;

  const showSummaryScreen = activityProgress?.isSummaryScreenOpen ?? false;

  if (!isActivityStarted) {
    return <WelcomeScreen />;
  }

  if (showSummaryScreen) {
    return <SummaryScreen />;
  }

  return <PassingScreen />;
};
