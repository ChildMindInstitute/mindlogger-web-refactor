import { useCallback } from 'react';

import { AxiosError } from 'axios';

import { actions } from '../slice';
import type { ProlificUrlParamsPayload } from '../types';

import { prolificParamsSelector } from '~/entities/applet/model/selectors';
import { useAppDispatch, useAppSelector, useCustomTranslation } from '~/shared/utils';

export const useProlific = () => {
  const { t } = useCustomTranslation();
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

  const handleProlificSubmitError = useCallback(
    (error: AxiosError, addErrorBanner: (message: string) => void) => {
      if (!prolificParams) {
        return;
      }

      if (error.response?.status === 400) {
        addErrorBanner(t('prolific.alreadyAnswered'));
      } else if (error.response?.status === 403) {
        addErrorBanner(t('prolific.nocode'));
      } else {
        throw error;
      }
    },
    [prolificParams, t],
  );

  return {
    saveProlificParams,
    clearProlificParams,
    handleProlificSubmitError,
    prolificParams,
  };
};
