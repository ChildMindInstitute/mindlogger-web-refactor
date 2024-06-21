import { useContext, useEffect } from 'react';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { SurveyContext } from '~/features/PassSurvey';
import { getMsFromHours, getMsFromMinutes, useAppSelector, useTimer } from '~/shared/utils';

type Props = {
  onFinish: () => void;
};

export const useEntityTimer = ({ onFinish }: Props) => {
  const context = useContext(SurveyContext);

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(
      state,
      getProgressId(context.activityId, context.eventId),
    ),
  );

  const { setTimer, resetTimer } = useTimer();

  useEffect(() => {
    console.log('[useEntityTimer] useEffect');
    const groupProgress = getGroupProgress({
      entityId: context.entityId,
      eventId: context.eventId,
    });

    const isSummaryScreenOpen = activityProgress?.isSummaryScreenOpen ?? false;

    const timerSettings = context.event.timers.timer;

    const entityStartedAt = groupProgress?.startAt ?? null;

    if (!groupProgress || !entityStartedAt || !timerSettings || isSummaryScreenOpen) {
      return;
    }

    const now = Date.now();

    const entityDuration: number =
      getMsFromHours(timerSettings.hours) + getMsFromMinutes(timerSettings.minutes);

    const timerLogicIsUsed: boolean = entityDuration > 0;

    if (!timerLogicIsUsed) {
      return;
    }

    const alreadyElapsed: number = now - entityStartedAt;

    const noTimeLeft: boolean = alreadyElapsed > entityDuration;

    if (noTimeLeft) {
      // TODO: add logic for finishing the entity
      onFinish();
    }

    const durationLeft = entityDuration - alreadyElapsed;

    console.log(`[useEntityTimer] Setting timer with durationLeft: ${durationLeft}ms`);
    setTimer({
      time: durationLeft,
      onComplete: () => {
        // TODO: add logic for finishing the entity
        console.log('[useEntityTimer] Timer completed');
        onFinish();
      },
    });

    return () => {
      console.log('[useEntityTimer] Clearing timer');
      resetTimer();
    };
  }, [
    activityProgress?.isSummaryScreenOpen,
    context.entityId,
    context.event.timers.timer,
    context.eventId,
    getGroupProgress,
    onFinish,
    resetTimer,
    setTimer,
  ]);
};
