import { useCallback } from 'react';

import { actions } from '../slice';

import { useAppDispatch } from '~/shared/utils';

export const useClearStore = () => {
  const dispatch = useAppDispatch();

  const clearStore = useCallback(() => {
    dispatch(actions.clearStore());
  }, [dispatch]);

  return {
    clearStore,
  };
};
