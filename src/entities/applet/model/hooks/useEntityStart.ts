import { groupProgressSelector } from '../selectors';
import { actions } from '../slice';

import { GroupProgress, getProgressId } from '~/abstract/lib';
import { ActivityFlowDTO } from '~/shared/api';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

export const useEntityStart = () => {
  const dispatch = useAppDispatch();
  const groupProgress = useAppSelector(groupProgressSelector);

  const getProgress = (entityId: string, eventId: string): GroupProgress =>
    groupProgress[getProgressId(entityId, eventId)];

  const isInProgress = (payload: GroupProgress): boolean => payload && !payload.endAt;

  function activityStarted(activityId: string, eventId: string): void {
    dispatch(
      actions.activityStarted({
        activityId,
        eventId,
      }),
    );
  }

  function removeActivityProgress(activityId: string, eventId: string): void {
    dispatch(
      actions.removeActivityProgress({
        activityId,
        eventId,
      }),
    );
  }

  function flowStarted(
    flowId: string,
    activityId: string,
    eventId: string,
    pipelineActivityOrder: number,
  ): void {
    dispatch(
      actions.flowStarted({
        flowId,
        activityId,
        eventId,
        pipelineActivityOrder,
      }),
    );
  }

  function startActivity(activityId: string, eventId: string): void {
    const isActivityInProgress = isInProgress(getProgress(activityId, eventId));

    if (isActivityInProgress) {
      return;
    }

    return activityStarted(activityId, eventId);
  }

  function startFlow(
    flowId: string,
    eventId: string,
    flows: ActivityFlowDTO[],
    shouldRestart: boolean,
  ): void {
    const isFlowInProgress = isInProgress(getProgress(flowId, eventId));

    if (isFlowInProgress && !shouldRestart) {
      return;
    }

    const flow = flows.find((x) => x.id === flowId);

    const flowActivities: string[] | null = flow?.activityIds ?? null;

    if (!flowActivities) {
      throw new Error(
        `[useStartEntity:startFlow] Flow with id ${flowId} does not have any activities`,
      );
    }

    const firstActivityId: string = flowActivities[0];

    if (shouldRestart) {
      removeFlowActivitiesProgress(flowActivities, eventId);
    }

    return flowStarted(flowId, firstActivityId, eventId, 0);
  }

  function removeFlowActivitiesProgress(actividyIds: string[], eventId: string): void {
    for (const activityId of actividyIds) {
      removeActivityProgress(activityId, eventId);
    }
  }

  return { startActivity, startFlow };
};
