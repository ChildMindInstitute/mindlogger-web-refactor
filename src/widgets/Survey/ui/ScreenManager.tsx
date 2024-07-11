import { useCallback, useContext } from 'react';

import PassingScreen from './PassingScreen';
import SummaryScreen from './SummaryScreen';
import WelcomeScreen from './WelcomeScreen';
import { useEntityTimer } from '../model/hooks';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import { CompletionContructService } from '~/features/AutoCompletion/model';
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

  const { saveAutoCompletion } = AutoCompletionModel.useAutoCompletionStateManager();

  const onEntityTimerFinish = useCallback(() => {
    const activitiesToSubmit: string[] =
      CompletionContructService.extractActivityIdsToSubmitByParams({
        isFlow: !!context.flow,
        currentActivityId: context.activityId,
        flowActivityIds: context.flow?.activityIds ?? null,
      });

    saveAutoCompletion({
      entityId: context.entityId,
      eventId: context.eventId,
      autoCompletion: {
        activityIdsToSubmit: activitiesToSubmit,
        successfullySubmittedActivityIds: [],
      },
    });

    return openTimesUpModal();
  }, [
    context.activityId,
    context.entityId,
    context.eventId,
    context.flow,
    openTimesUpModal,
    saveAutoCompletion,
  ]);

  useEntityTimer({
    onFinish: onEntityTimerFinish,
  });

  const items = activityProgress?.items ?? [];

  const showSummaryScreen = activityProgress?.isSummaryScreenOpen ?? false;

  const isActivityStarted = items.length > 0;

  if (!isActivityStarted) {
    return <WelcomeScreen />;
  }

  if (showSummaryScreen) {
    return <SummaryScreen />;
  }

  return <PassingScreen />;
};
