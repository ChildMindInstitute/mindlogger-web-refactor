import { useCallback } from 'react';

import { actions, SetAutoCompletionPayload, SetAutoCompletionStatus } from '../slice';

import { useAppDispatch } from '~/shared/utils';

export const useAutoCompletionState = () => {
  const dispatch = useAppDispatch();

  const clearAutoCompletionState = useCallback(() => {
    dispatch(actions.clearAutoCompletionState());
  }, [dispatch]);

  const saveAutoCompletion = useCallback(
    (payload: SetAutoCompletionPayload) => {
      dispatch(actions.setAutoCompletion(payload));
    },
    [dispatch],
  );

  const removeAutoCompletion = useCallback(
    (payload: { entityId: string; eventId: string }) => {
      dispatch(actions.removeAutoCompletion(payload));
    },
    [dispatch],
  );

  const setAutoCompletionStatus = useCallback(
    (payload: SetAutoCompletionStatus) => {
      dispatch(actions.setAutoCompletionStatus(payload));
    },
    [dispatch],
  );

  return {
    clearAutoCompletionState,
    saveAutoCompletion,
    removeAutoCompletion,
    setAutoCompletionStatus,
  };
};
