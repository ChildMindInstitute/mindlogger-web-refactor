import { useContext } from 'react';

import PassingScreen from './PassingScreen';
import SummaryScreen from './SummaryScreen';
import WelcomeScreen from './WelcomeScreen';
import { SurveyContext } from '../lib';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
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

  const showSummaryScreen = activityProgress?.isSummaryScreenOpen ?? false;

  const isActivityStarted = items.length > 0;

  // TODO: Commented out because it will be user in the next PR
  // const onEntityTimerFinish = () => {
  //   // Open "Time is up" modal
  //   openTimesUpModal();
  // };

  // useEntityTimer({
  //   onFinish: onEntityTimerFinish,
  // });

  if (!isActivityStarted) {
    return <WelcomeScreen />;
  }

  if (showSummaryScreen) {
    return <SummaryScreen />;
  }

  return <PassingScreen />;
};
