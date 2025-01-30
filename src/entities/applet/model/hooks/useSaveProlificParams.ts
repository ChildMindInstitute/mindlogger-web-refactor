import { useCallback } from 'react';

import { actions } from '../slice';
import type { ProlificUrlParamsPayload } from '../types';

import { useAppDispatch } from '~/shared/utils';

export const useUpdateProlificParams = () => {
  const dispatch = useAppDispatch();

  const saveProlificParams = useCallback(
    (payload: ProlificUrlParamsPayload) => {
      dispatch(actions.saveProlificParams(payload));
    },
    [dispatch],
  );

  const clearProlificParams = useCallback(() => {
    dispatch(actions.clearProlificParams());
  }, [dispatch]);

  return { saveProlificParams, clearProlificParams };
};
