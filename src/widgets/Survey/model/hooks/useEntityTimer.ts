import { useContext, useEffect } from 'react';

import { SurveyContext } from '../../lib';

import { appletModel } from '~/entities/applet';
import { getMsFromHours, getMsFromMinutes, useTimer } from '~/shared/utils';

export const useEntityTimer = () => {
  const context = useContext(SurveyContext);

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const { setTimer, resetTimer } = useTimer();

  useEffect(() => {
    const groupProgress = getGroupProgress({ entityId: context.eventId, eventId: context.eventId });

    const timerSettings = context.event.timers.timer;

    const entityStartedAt = groupProgress?.startAt ?? null;

    if (!groupProgress || !entityStartedAt || !timerSettings) {
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
    }

    const durationLeft = entityDuration - alreadyElapsed;

    setTimer({
      time: durationLeft,
      onComplete: () => {
        // TODO: add logic for finishing the entity
      },
    });

    return () => {
      resetTimer();
    };
  }, [context.event.timers.timer, context.eventId, getGroupProgress, resetTimer, setTimer]);
};
