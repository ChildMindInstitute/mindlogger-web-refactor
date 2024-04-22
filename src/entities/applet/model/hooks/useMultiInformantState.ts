import { useCallback } from 'react';

import { multiInformantStateSelector } from '../selectors';
import { actions } from '../slice';
import { MultiInformantPayload } from '../types';

import { MultiInformantState } from '~/abstract/lib/types/multiInformant';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type Return = {
  getMultiInformantState: () => MultiInformantState;
  initiateTakeNow: (payload: MultiInformantPayload) => void;
  resetMultiInformantState: () => void;
};

export const useMultiInformantState = (): Return => {
  const dispatch = useAppDispatch();
  const multiInformantState = useAppSelector(multiInformantStateSelector);

  const getMultiInformantState = useCallback(() => multiInformantState, [multiInformantState]);

  const initiateTakeNow = useCallback(
    (payload: MultiInformantPayload) => {
      dispatch(actions.initiateTakeNow(payload));
    },
    [dispatch],
  );

  const resetMultiInformantState = useCallback(() => {
    dispatch(actions.resetMultiInformantState());
  }, [dispatch]);

  return {
    getMultiInformantState,
    initiateTakeNow,
    resetMultiInformantState,
  };
};