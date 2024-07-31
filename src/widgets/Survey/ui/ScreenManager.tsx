import { useCallback, useContext, useEffect } from 'react';

import PassingScreen from './PassingScreen';
import SummaryScreen from './SummaryScreen';
import WelcomeScreen from './WelcomeScreen';
import { useEntityTimer } from '../model/hooks';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { AutoCompletionModel } from '~/features/AutoCompletion';
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

  const autoCompletionState = AutoCompletionModel.useAutoCompletionRecord({
    entityId: context.entityId,
    eventId: context.eventId,
  });
  const { saveAutoCompletion } = AutoCompletionModel.useAutoCompletionStateManager();

  const onTimerFinish = useCallback(() => {
    const activitiesToSubmit: string[] = AutoCompletionModel.extractActivityIdsToSubmitByParams({
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
    onFinish: onTimerFinish,
  });

  useEffect(() => {
    if (!autoCompletionState) {
      return;
    }

    if (
      autoCompletionState.activityIdsToSubmit.length ===
      autoCompletionState.successfullySubmittedActivityIds.length
    ) {
      return;
    }

    if (openTimesUpModal) {
      openTimesUpModal();
    }
  }, [autoCompletionState, openTimesUpModal]);

  const items = activityProgress?.items ?? [];

  const showSummaryScreen = activityProgress?.isSummaryScreenOpen ?? false;

  const isActivityStarted = items.length > 0;

  if (!isActivityStarted) {
    return <WelcomeScreen />;
  }

  if (showSummaryScreen) {
    return <SummaryScreen />;
  }

  return <PassingScreen onTimerFinish={onTimerFinish} />;
};
