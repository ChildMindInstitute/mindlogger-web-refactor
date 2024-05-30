import { useEffect } from 'react';

import { canItemHaveTimer } from '../lib';

import { appletModel } from '~/entities/applet';
import { usePrevious } from '~/shared/utils';
import useTimer from '~/shared/utils/useTimer';

type Props = {
  item: appletModel.ItemRecord;
  onTimerEnd: () => void;
};

const ONE_SECOND_IN_MILLISECONDS = 1000;

export const useItemTimer = ({ item, onTimerEnd }: Props) => {
  const { setTimer, currentTime, percentageLeft, initialTime } = useTimer();

  const prevItem = usePrevious(item);

  useEffect(() => {
    if (!item) {
      return;
    }

    if (!canItemHaveTimer(item)) {
      return;
    }

    if (item.id === prevItem?.id) {
      return;
    }

    if (item.config.timer && item.config.timer > 0)
      setTimer({ duration: item.config.timer * ONE_SECOND_IN_MILLISECONDS, callback: onTimerEnd });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, prevItem]);

  return {
    currentTime,
    percentageLeft,
    initialTime,
  };
};
