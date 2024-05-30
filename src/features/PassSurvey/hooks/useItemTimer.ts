import { useEffect } from 'react';

import { canItemHaveTimer } from '../lib';

import { appletModel } from '~/entities/applet';
import useTimer from '~/shared/utils/useTimer';

type Props = {
  item: appletModel.ItemRecord;
  onTimerEnd: () => void;
};

const ONE_SECOND_IN_MILLISECONDS = 1000;

export const useItemTimer = ({ item, onTimerEnd }: Props) => {
  const { setTimer, currentTime } = useTimer();

  useEffect(() => {
    if (!item) {
      return;
    }

    if (!canItemHaveTimer(item)) {
      return;
    }

    if (item.config.timer && item.config.timer > 0)
      setTimer({ duration: item.config.timer * ONE_SECOND_IN_MILLISECONDS, callback: onTimerEnd });
  }, []);

  return {
    currentTime,
  };
};
