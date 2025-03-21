import { useCallback } from 'react';

import { actions } from '../slice';
import type { ProlificUrlParamsPayload } from '../types';

import { prolificParamsSelector } from '~/entities/applet/model/selectors';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

export const useProlific = () => {
  const dispatch = useAppDispatch();

  const prolificParams = useAppSelector(prolificParamsSelector);

  const saveProlificParams = useCallback(
    (payload: ProlificUrlParamsPayload) => {
      dispatch(actions.saveProlificParams(payload));
    },
    [dispatch],
  );

  const clearProlificParams = useCallback(() => {
    dispatch(actions.clearProlificParams());
  }, [dispatch]);

  const handleProlificError = useCallback(
    (handle: () => void) => {
      if (!prolificParams) {
        return;
      }

      handle();
    },
    [prolificParams],
  );

  return { saveProlificParams, clearProlificParams, handleProlificError, prolificParams };
};
