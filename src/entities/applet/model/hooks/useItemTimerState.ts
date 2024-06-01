import { selectActivityProgress } from '../selectors';
import { actions } from '../slice';
import { ItemTimerProgress } from '../types';

import { getProgressId } from '~/abstract/lib';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type Props = {
  activityId: string;
  eventId: string;
};

type Return = {
  getItemTimerStatus: (itemId: string) => ItemTimerProgress | null;
  initializeTimer: (props: InitializeTimerProps) => void;
  timerTick: (itemId: string) => void;
  completeTimer: (itemId: string) => void;
};

type InitializeTimerProps = {
  activityId: string;
  eventId: string;
  itemId: string;
  duration: number;
};

/**
 * Custom hook for managing item timer state.
 *
 * @param {Props} props - The props containing activityId and eventId.
 * @returns {Return} - An object containing the getItemTimerStatus, startTimer, and timerTick functions.
 */
export const useItemTimerState = ({ activityId, eventId }: Props): Return => {
  const dispatch = useAppDispatch();

  const activityProgress = useAppSelector((state) =>
    selectActivityProgress(state, getProgressId(activityId, eventId)),
  );

  /**
   * Get the timer status for a specific item.
   *
   * @param {string} itemId - The ID of the item.
   * @returns {ItemTimerProgress | null} - The timer status for the item, or null if it doesn't exist.
   */
  const getItemTimerStatus = (itemId: string): ItemTimerProgress | null => {
    if (!activityProgress) return null;

    const status = activityProgress.itemTimer[itemId];

    return status ?? null;
  };

  /**
   * Start the timer for a specific item.
   *
   * @param {InitializeTimerProps} props - The props containing activityId, eventId, itemId, and timerTimeMS.
   */
  const initializeTimer = ({ activityId, eventId, itemId, duration }: InitializeTimerProps) => {
    return dispatch(
      actions.setItemTimerStatus({
        activityId,
        eventId,
        itemId,
        timerStatus: {
          isStarted: true,
          isElapsed: false,
          duration,
          spentTime: 0,
        },
      }),
    );
  };

  /**
   * Increment the spent time for a specific item for ONE second.
   *
   * @param {string} itemId - The ID of the item.
   */
  const timerTick = (itemId: string) => {
    return dispatch(
      actions.itemTimerTick({
        activityId,
        eventId,
        itemId,
      }),
    );
  };

  /**
   * Complete the timer for a specific item.
   *
   * @param {string} itemId - The ID of the item.
   */
  const completeTimer = (itemId: string) => {
    const timerStatus = getItemTimerStatus(itemId);

    if (!timerStatus) return;

    return dispatch(
      actions.setItemTimerStatus({
        activityId,
        eventId,
        itemId,
        timerStatus: {
          ...timerStatus,
          isElapsed: true,
        },
      }),
    );
  };

  return {
    getItemTimerStatus,
    initializeTimer,
    timerTick,
    completeTimer,
  };
};
