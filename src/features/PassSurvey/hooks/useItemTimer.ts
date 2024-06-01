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
  onTimerEnd: () => void;
};

export type TimerSettings = {
  time: number | null;
  progress: number | null;
  duration: number | null;
};

export const useItemTimer = ({ item, onTimerEnd, activityId, eventId }: Props): TimerSettings => {
  const prevItem = usePrevious(item);

  const { timerSettings, initializeTimer, timerTick } = appletModel.hooks.useItemTimerState({
    activityId,
    eventId,
    itemId: item.id,
  });

  const duration = timerSettings?.duration ?? null;
  const time = timerSettings ? timerSettings.duration - timerSettings.spentTime : null;

  const { setTimer, resetTimer } = useTimer();

  useEffect(() => {
    if (!item) throw new Error('[UseItemTimer] Item is required for the timer to work.');

    if (!canItemHaveTimer(item)) return;

    const timer = item.config.timer;

    if (!timer || timer === 0) return;

    if (!timerSettings) {
      initializeTimer({
        itemId: item.id,
        duration: timer,
      });

      setTimer({
        time: ONE_SEC,
        onComplete: () => timerTick(item.id),
      });
      return;
    }

    // const isSameItem = item.id === prevItem?.id;

    // if (isSameItem) return;

    const isElapsed = timerSettings.spentTime >= timerSettings.duration;

    if (isElapsed) return;

    const inProgress =
      timerSettings.spentTime > 0 && timerSettings.spentTime < timerSettings.duration;

    const isLastTick = timerSettings.spentTime === timerSettings.duration - 1;

    const onCompleteHandler = () => {
      if (isLastTick) onTimerEnd();
      timerTick(item.id);
    };

    if (inProgress) {
      setTimer({
        time: ONE_SEC,
        onComplete: onCompleteHandler,
      });
    }
  }, [initializeTimer, item, timerSettings, onTimerEnd, prevItem, resetTimer, setTimer, timerTick]);

  return {
    duration,
    time,
    progress: time && duration ? (time / duration) * 100 : null,
  };
};
