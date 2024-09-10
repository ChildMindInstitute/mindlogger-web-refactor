import { useCallback } from 'react';

import { actions, SetAutoCompletionPayload } from '../slice';

import { useAppDispatch } from '~/shared/utils';

export type ActivitySuccessfullySubmitted = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;

  activityId: string;
};

export const useAutoCompletionStateManager = () => {
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
    (payload: { entityId: string; eventId: string; targetSubjectId: string | null }) => {
      dispatch(actions.removeAutoCompletion(payload));
    },
    [dispatch],
  );

  const activitySuccessfullySubmitted = useCallback(
    (payload: ActivitySuccessfullySubmitted) => {
      dispatch(actions.activitySuccessfullySubmitted(payload));
    },
    [dispatch],
  );

  return {
    clearAutoCompletionState,
    saveAutoCompletion,
    removeAutoCompletion,
    activitySuccessfullySubmitted,
  };
};
