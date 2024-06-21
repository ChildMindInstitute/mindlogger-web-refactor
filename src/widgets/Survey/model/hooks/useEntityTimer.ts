import { useContext, useEffect, useRef } from 'react';

import { SurveyContext } from '../../lib';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
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

  const finishRef = useRef(onFinish);

  finishRef.current = onFinish;

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

    const entityDuration: number =
      getMsFromHours(timerSettings.hours) + getMsFromMinutes(timerSettings.minutes);

    const timerLogicIsUsed: boolean = entityDuration > 0;

    if (!timerLogicIsUsed) {
      return;
    }

    const alreadyElapsed: number = Date.now() - entityStartedAt;

    const noTimeLeft: boolean = alreadyElapsed > entityDuration;

    if (noTimeLeft) {
      finishRef.current();
    }

    const durationLeft = entityDuration - alreadyElapsed;

    console.log(`[useEntityTimer] Setting timer with durationLeft: ${durationLeft}ms`);
    setTimer({
      time: durationLeft,
      onComplete: () => {
        finishRef.current();
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
