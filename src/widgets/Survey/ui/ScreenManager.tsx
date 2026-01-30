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
  const { setActiveAssessment } = appletModel.hooks.useActiveAssessment();

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(
      state,
      getProgressId(context.activityId, context.eventId, context.targetSubject?.id),
    ),
  );

  const { saveAutoCompletion } = AutoCompletionModel.useAutoCompletionStateManager();

  const onTimerFinish = useCallback(() => {
    const activitiesToSubmit: string[] = AutoCompletionModel.extractActivityIdsToSubmitByParams({
      isFlow: !!context.flow,
      interruptedActivityId: context.activityId,
      flowActivityIds: context.flow?.activityIds ?? null,
      interruptedActivityProgress: activityProgress ?? null,
    });

    saveAutoCompletion({
      entityId: context.entityId,
      eventId: context.eventId,
      targetSubjectId: context.targetSubject?.id ?? null,
      autoCompletion: {
        activityIdsToSubmit: activitiesToSubmit,
        successfullySubmittedActivityIds: [],
      },
    });

    return openTimesUpModal();
  }, [
    activityProgress,
    context.activityId,
    context.entityId,
    context.eventId,
    context.flow,
    context.targetSubject?.id,
    openTimesUpModal,
    saveAutoCompletion,
  ]);

  useEntityTimer({
    onFinish: onTimerFinish,
  });

  const items = activityProgress?.items ?? [];

  const showSummaryScreen = activityProgress?.isSummaryScreenOpen ?? false;

  const isActivityStarted = items.length > 0;

  // Update active assessment
  useEffect(() => {
    setActiveAssessment({
      appletId: context.appletId,
      publicAppletKey: context.publicAppletKey,
      groupProgressId: getProgressId(
        context.flow ? context.flow.id : context.activityId,
        context.eventId,
        context.targetSubject?.id ?? null,
      ),
    });
  }, [
    context.flow,
    context.activityId,
    context.appletId,
    context.eventId,
    context.publicAppletKey,
    context.targetSubject?.id,
    setActiveAssessment,
  ]);

  if (!isActivityStarted) {
    return <WelcomeScreen />;
  }

  if (showSummaryScreen) {
    return <SummaryScreen />;
  }

  return <PassingScreen onTimerFinish={onTimerFinish} />;
};
