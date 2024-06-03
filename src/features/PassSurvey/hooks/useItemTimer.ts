import { useEffect } from 'react';

import { canItemHaveTimer } from '../lib';

import { appletModel } from '~/entities/applet';
import { usePrevious } from '~/shared/utils';
import useTimer from '~/shared/utils/useTimer';

const ONE_SEC = 1000;

type Props = {
  activityId: string;
  eventId: string;
  item: appletModel.ItemRecord;
  isSubmitModalOpen: boolean;
  onTimerEnd: () => void;
};

export type TimerSettings = {
  time: number | null;
  progress: number | null;
  duration: number | null;
};

export const useItemTimer = ({
  item,
  onTimerEnd,
  activityId,
  eventId,
  isSubmitModalOpen,
}: Props): TimerSettings => {
  const prevItem = usePrevious(item);

  const { timerSettings, initializeTimer, timerTick, removeTimer } =
    appletModel.hooks.useItemTimerState({
      activityId,
      eventId,
      itemId: item.id,
    });

  const duration = timerSettings?.duration ?? null;
  const time = timerSettings ? timerSettings.duration - timerSettings.spentTime : null;

  const { setTimer } = useTimer();

  useEffect(() => {
    if (!item) throw new Error('[UseItemTimer] Item is required for the timer to work.');

    if (!canItemHaveTimer(item)) return;

    const timer = item.config.timer;

    if (!timer || timer === 0) return;

    if (isSubmitModalOpen) return;

    if (!timerSettings) {
      initializeTimer({
        duration: timer,
      });
      return;
    }

    const isElapsed = timerSettings.spentTime >= timerSettings.duration;

    if (isElapsed) {
      onTimerEnd();
      removeTimer();
      return;
    }

    const inProgress =
      timerSettings.spentTime >= 0 && timerSettings.spentTime < timerSettings.duration;

    if (inProgress) {
      setTimer({
        time: ONE_SEC,
        onComplete: timerTick,
      });
    }
  }, [
    initializeTimer,
    item,
    timerSettings,
    onTimerEnd,
    prevItem,
    setTimer,
    timerTick,
    isSubmitModalOpen,
    removeTimer,
  ]);

  return {
    duration,
    time,
    progress: time && duration ? (time / duration) * 100 : null,
  };
};
