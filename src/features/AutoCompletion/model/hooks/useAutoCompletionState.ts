import { useCallback } from 'react';

import { actions } from '../slice';

import { ActivityPipelineType } from '~/abstract/lib';
import { useAppDispatch } from '~/shared/utils';

type RegularAutoCompletionPayload = {
  activityId: string;
  eventId: string;
};

type FlowAutoCompletionPayload = {
  flowId: string;
  eventId: string;

  currentActivityId: string;
  currentActivityIndex: number;

  activitiesInFlow: string[];
};

export const useAutoCompletionState = () => {
  const dispatch = useAppDispatch();

  const setRegularAutoCompletion = useCallback(
    (payload: RegularAutoCompletionPayload) => {
      dispatch(
        actions.addAutoCompletionRecord({
          type: ActivityPipelineType.Regular,
          activityId: payload.activityId,
          eventId: payload.eventId,
        }),
      );
    },
    [dispatch],
  );

  const setFlowAutoCompletion = useCallback(
    (payload: FlowAutoCompletionPayload) => {
      dispatch(
        actions.addAutoCompletionRecord({
          type: ActivityPipelineType.Flow,
          flowId: payload.flowId,
          eventId: payload.eventId,
          currentActivityId: payload.currentActivityId,
          currentActivityIndex: payload.currentActivityIndex,
          activitiesInFlow: payload.activitiesInFlow,
        }),
      );
    },
    [dispatch],
  );

  const removeAutoCompletion = useCallback(
    (autoComletionId: string) => {
      dispatch(actions.removeAutoCompletionRecord(autoComletionId));
    },
    [dispatch],
  );

  return {
    setRegularAutoCompletion,
    setFlowAutoCompletion,
    removeAutoCompletion,
  };
};
