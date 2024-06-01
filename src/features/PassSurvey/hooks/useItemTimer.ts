import { useCallback, useEffect, useState } from 'react';

import { canItemHaveTimer } from '../lib';

import { appletModel } from '~/entities/applet';
import { ItemTimerProgress } from '~/entities/applet/model';
import { usePrevious } from '~/shared/utils';
import useTimer from '~/shared/utils/useTimer';

const ONE_SEC = 1000;

type Props = {
  activityId: string;
  eventId: string;
  item: appletModel.ItemRecord;
  onTimerEnd: () => void;
};

export type TimerSettings = {
  time: number | null;
  progress: number | null;
  duration: number | null;
};

export const useItemTimer = ({ item, onTimerEnd, activityId, eventId }: Props): TimerSettings => {
  const prevItem = usePrevious(item);

  const [duration, setDuration] = useState<number | null>(null);

  const {
    itemTimerSettings,
    initializeTimer: initializeTimerState,
    timerTick,
  } = appletModel.hooks.useItemTimerState({
    activityId,
    eventId,
    itemId: item.id,
  });

  const { setTimer, time, resetTimer } = useTimer();

  const initializeTimer = useCallback(
    (itemId: string, duration: number) => {
      setTimer({
        time: duration * ONE_SEC,
        onTick: () => timerTick(itemId),
        onComplete: onTimerEnd,
      });

      return initializeTimerState({
        itemId,
        duration,
      });
    },
    [initializeTimerState, onTimerEnd, setTimer, timerTick],
  );

  const resumeTimer = useCallback(
    (timerStatus: ItemTimerProgress, itemId: string) => {
      return setTimer({
        time: (timerStatus.duration - timerStatus.spentTime) * ONE_SEC,
        onTick: () => timerTick(itemId),
        onComplete: onTimerEnd,
      });
    },
    [onTimerEnd, setTimer, timerTick],
  );

  const startTimer = useCallback(
    (duration: number, itemId: string) => {
      setDuration(duration * ONE_SEC);

      if (itemTimerSettings !== null) {
        return resumeTimer(itemTimerSettings, itemId);
      }

      return initializeTimer(itemId, duration);
    },
    [itemTimerSettings, initializeTimer, resumeTimer],
  );

  useEffect(() => {
    if (!item) throw new Error('[UseItemTimer] Item is required for the timer to work.');

    if (item.id === prevItem?.id) return;

    if (!canItemHaveTimer(item)) {
      resetTimer();
      return;
    }

    if (item.config.timer && item.config.timer > 0) {
      startTimer(item.config.timer, item.id);
    }
  }, [item, prevItem, resetTimer, startTimer]);

  return {
    time,
    progress: duration && time ? (time / duration) * 100 : null,
    duration,
  };
};
