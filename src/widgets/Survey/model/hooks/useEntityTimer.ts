import { useContext, useEffect, useRef } from 'react';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { SurveyContext } from '~/features/PassSurvey';
import { getMsFromHours, getMsFromMinutes, useAppSelector, useTimer } from '~/shared/utils';

type Props = {
  onFinish: () => void;
};

export const useEntityTimer = ({ onFinish }: Props) => {
  const context = useContext(SurveyContext);

  const groupProgress = appletModel.hooks.useGroupProgressRecord({
    entityId: context.entityId,
    eventId: context.eventId,
    targetSubjectId: context.targetSubject?.id ?? null,
  });

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(
      state,
      getProgressId(context.activityId, context.eventId, context.targetSubject?.id),
    ),
  );

  const { setTimer, resetTimer } = useTimer();

  const finishRef = useRef(onFinish);

  finishRef.current = onFinish;

  useEffect(() => {
    const isSummaryScreenOpen = activityProgress?.isSummaryScreenOpen ?? false;

    const timerSettings = context.event.timers.timer;

    if (!groupProgress || !timerSettings || isSummaryScreenOpen) {
      return;
    }

    const entityStartedAt = groupProgress.startAt;
    const entityEndedAt = groupProgress.endAt;

    if (!entityStartedAt) {
      return;
    }

    if (entityEndedAt) {
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
    groupProgress,
    onFinish,
    resetTimer,
    setTimer,
  ]);
};
