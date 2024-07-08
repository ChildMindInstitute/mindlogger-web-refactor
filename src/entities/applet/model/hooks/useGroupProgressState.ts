import { useCallback } from 'react';

import { groupProgressSelector } from '../selectors';
import { actions } from '../slice';
import {
  InProgressEntity,
  InProgressFlow,
  RemoveGroupProgressPayload,
  SaveGroupProgressPayload,
  SaveSummaryDataInContext,
} from '../types';

import { GroupProgress, getProgressId } from '~/abstract/lib';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type Return = {
  getGroupProgress: (params: InProgressEntity) => GroupProgress | null;
  saveGroupProgress: (payload: SaveGroupProgressPayload) => void;
  saveSummaryDataInContext: (payload: SaveSummaryDataInContext) => void;
  removeGroupProgress: (payload: RemoveGroupProgressPayload) => void;

  entityCompleted: (props: InProgressEntity) => void;
  flowUpdated: (props: InProgressFlow) => void;
};

export const useGroupProgressState = (): Return => {
  const dispatch = useAppDispatch();
  const groupProgresses = useAppSelector(groupProgressSelector);

  const getGroupProgress = useCallback(
    (params: InProgressEntity) => {
      if (!params.entityId || !params.eventId) {
        return null;
      }

      return groupProgresses[getProgressId(params.entityId, params.eventId)] ?? null;
    },
    [groupProgresses],
  );

  const flowUpdated = useCallback(
    (props: InProgressFlow) => {
      dispatch(actions.flowUpdated(props));
    },
    [dispatch],
  );

  const entityCompleted = useCallback(
    (props: InProgressEntity) => {
      dispatch(actions.entityCompleted(props));
    },
    [dispatch],
  );

  const saveGroupProgress = useCallback(
    (payload: SaveGroupProgressPayload) => {
      dispatch(actions.saveGroupProgress(payload));
    },
    [dispatch],
  );

  const removeGroupProgress = useCallback(
    (payload: RemoveGroupProgressPayload) => {
      dispatch(actions.removeGroupProgress(payload));
    },
    [dispatch],
  );

  const saveSummaryDataInContext = useCallback(
    (payload: SaveSummaryDataInContext) => {
      dispatch(actions.saveSummaryDataInGroupContext(payload));
    },
    [dispatch],
  );

  return {
    getGroupProgress,

    removeGroupProgress,
    saveGroupProgress,
    saveSummaryDataInContext,

    entityCompleted,
    flowUpdated,
  };
};
