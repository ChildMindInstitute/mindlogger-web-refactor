import { useContext } from 'react';

import PassingScreen from './PassingScreen';
import SummaryScreen from './SummaryScreen';
import WelcomeScreen from './WelcomeScreen';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { SurveyContext } from '~/features/PassSurvey';
import { useAppSelector } from '~/shared/utils';

type Props = {
  openTimesUpModal: () => void;
};

export const ScreenManager = ({ openTimesUpModal }: Props) => {
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
