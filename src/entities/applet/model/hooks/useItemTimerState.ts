import { selectActivityProgress } from '../selectors';
import { actions } from '../slice';
import { ItemTimerProgress } from '../types';

import { getProgressId } from '~/abstract/lib';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type Props = {
  activityId: string;
  eventId: string;
  itemId: string;
};

type Return = {
  itemTimerSettings: ItemTimerProgress | null;
  initializeTimer: (props: InitializeTimerProps) => void;
  timerTick: (itemId: string) => void;
};

type InitializeTimerProps = {
  itemId: string;
  duration: number;
};

export const useItemTimerState = ({ activityId, eventId, itemId }: Props): Return => {
  const dispatch = useAppDispatch();

  const timerSettings = useAppSelector((state) =>
    selectActivityProgress(state, getProgressId(activityId, eventId)),
  );

  const itemTimerSettings = timerSettings?.itemTimer[itemId] ?? null;

  const initializeTimer = ({ itemId, duration }: InitializeTimerProps) => {
    return dispatch(
      actions.setItemTimerStatus({
        activityId,
        eventId,
        itemId,
        timerStatus: {
          duration,
          spentTime: 0,
        },
      }),
    );
  };

  const timerTick = (itemId: string) => {
    return dispatch(
      actions.itemTimerTick({
        activityId,
        eventId,
        itemId,
      }),
    );
  };

  return {
    itemTimerSettings,
    initializeTimer,
    timerTick,
  };
};
