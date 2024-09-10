import { groupProgressSelector } from '../selectors';
import { actions } from '../slice';

import { GroupProgress, getProgressId } from '~/abstract/lib';
import { ActivityFlowDTO } from '~/shared/api';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

export const useEntityStart = () => {
  const dispatch = useAppDispatch();
  const groupProgress = useAppSelector(groupProgressSelector);

  const getProgress = (
    entityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ): GroupProgress => groupProgress[getProgressId(entityId, eventId, targetSubjectId)];

  const isInProgress = (payload: GroupProgress): boolean => payload && !payload.endAt;

  function activityStarted(
    activityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ): void {
    dispatch(
      actions.activityStarted({
        activityId,
        eventId,
        targetSubjectId,
      }),
    );
  }

  function flowStarted(
    flowId: string,
    activityId: string,
    eventId: string,
    targetSubjectId: string | null,
    pipelineActivityOrder: number,
  ): void {
    dispatch(
      actions.flowStarted({
        flowId,
        activityId,
        eventId,
        targetSubjectId,
        pipelineActivityOrder,
      }),
    );
  }

  function startActivity(
    activityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ): void {
    const isActivityInProgress = isInProgress(getProgress(activityId, eventId, targetSubjectId));

    if (isActivityInProgress) {
      return;
    }

    return activityStarted(activityId, eventId, targetSubjectId);
  }

  function startFlow(eventId: string, flow: ActivityFlowDTO, targetSubjectId: string | null): void {
    const flowId = flow.id;

    const isFlowInProgress = isInProgress(getProgress(flowId, eventId, targetSubjectId));

    if (isFlowInProgress) {
      return;
    }

    const flowActivities: string[] | null = flow?.activityIds ?? null;

    if (!flowActivities) {
      throw new Error(
        `[useStartEntity:startFlow] Flow with id ${flowId} does not have any activities`,
      );
    }

    const firstActivityId: string = flowActivities[0];

    return flowStarted(flowId, firstActivityId, eventId, targetSubjectId, 0);
  }

  return { startActivity, startFlow };
};
