import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { activeAssessmentSelector } from '../selectors';
import { actions } from '../slice';

import { GroupProgressId } from '~/abstract/lib';

export const useActiveAssessment = () => {
  const dispatch = useDispatch();
  const activeAssessment = useSelector(activeAssessmentSelector);

  const setActiveAssessment = useCallback(
    ({
      appletId,
      publicAppletKey,
      groupProgressId,
    }: {
      appletId: string;
      publicAppletKey: string | null;
      groupProgressId: GroupProgressId;
    }) => {
      dispatch(
        actions.setActiveAssessment({
          appletId,
          publicAppletKey,
          groupProgressId,
        }),
      );
    },
    [dispatch],
  );

  const clearActiveAssessment = useCallback(() => {
    dispatch(actions.setActiveAssessment(null));
  }, [dispatch]);

  return {
    activeAssessment,
    setActiveAssessment,
    clearActiveAssessment,
  };
};
