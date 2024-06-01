import { useCallback } from 'react';

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
  timerSettings: ItemTimerProgress | null;
  initializeTimer: (props: InitializeTimerProps) => void;
  timerTick: (itemId: string) => void;
};

type InitializeTimerProps = {
  itemId: string;
  duration: number;
};

export const useItemTimerState = ({ activityId, eventId, itemId }: Props): Return => {
  const dispatch = useAppDispatch();

  const timerSettingsState = useAppSelector((state) =>
    selectActivityProgress(state, getProgressId(activityId, eventId)),
  );

  const timerSettings = timerSettingsState?.itemTimer[itemId] ?? null;

  const initializeTimer = useCallback(
    ({ itemId, duration }: InitializeTimerProps) => {
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
    },
    [activityId, dispatch, eventId],
  );

  const timerTick = useCallback(
    (itemId: string) => {
      return dispatch(
        actions.itemTimerTick({
          activityId,
          eventId,
          itemId,
        }),
      );
    },
    [activityId, dispatch, eventId],
  );

  return {
    timerSettings,
    initializeTimer,
    timerTick,
  };
};
