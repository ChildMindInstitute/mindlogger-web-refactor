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
  timerTick: () => void;
  removeTimer: () => void;
};

type InitializeTimerProps = {
  duration: number;
};

export const useItemTimerState = ({ activityId, eventId, itemId }: Props): Return => {
  const dispatch = useAppDispatch();

  const timerSettingsState = useAppSelector((state) =>
    selectActivityProgress(state, getProgressId(activityId, eventId)),
  );

  const timerSettings = timerSettingsState?.itemTimer[itemId] ?? null;

  const initializeTimer = useCallback(
    ({ duration }: InitializeTimerProps) => {
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
    [activityId, dispatch, eventId, itemId],
  );

  const removeTimer = useCallback(() => {
    return dispatch(
      actions.removeItemTimerStatus({
        activityId,
        eventId,
        itemId,
      }),
    );
  }, [activityId, dispatch, eventId, itemId]);

  const timerTick = useCallback(() => {
    return dispatch(
      actions.itemTimerTick({
        activityId,
        eventId,
        itemId,
      }),
    );
  }, [activityId, dispatch, eventId, itemId]);

  return {
    timerSettings,
    initializeTimer,
    timerTick,
    removeTimer,
  };
};
