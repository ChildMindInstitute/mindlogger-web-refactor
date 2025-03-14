import { groupProgressSelector } from '../selectors';
import { actions } from '../slice';

import { GroupProgress, getProgressId } from '~/abstract/lib';
import { ActivityFlowDTO, ScheduleEventDto } from '~/shared/api';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

export const useEntityStart = () => {
  const dispatch = useAppDispatch();
  const groupProgress = useAppSelector(groupProgressSelector);

  const getProgress = (
    entityId: string,
    eventId: string,
    targetSubjectId: string | null,
  ): GroupProgress | undefined => groupProgress[getProgressId(entityId, eventId, targetSubjectId)];

  const isInProgress = (payload: GroupProgress | undefined): boolean =>
    payload ? !payload.endAt : false;

  function activityStarted(
    activityId: string,
    event: ScheduleEventDto,
    targetSubjectId: string | null,
  ): void {
    dispatch(
      actions.activityStarted({
        activityId,
        event,
        targetSubjectId,
      }),
    );
  }

  function flowStarted(
    flowId: string,
    activityId: string,
    event: ScheduleEventDto,
    targetSubjectId: string | null,
    pipelineActivityOrder: number,
  ): void {
    dispatch(
      actions.flowStarted({
        flowId,
        activityId,
        event,
        targetSubjectId,
        pipelineActivityOrder,
      }),
    );
  }

  function startActivity(
    activityId: string,
    event: ScheduleEventDto,
    targetSubjectId: string | null,
  ): void {
    const groupProgress = getProgress(activityId, event.id, targetSubjectId);

    if (isInProgress(groupProgress)) {
      return;
    }

    return activityStarted(activityId, event, targetSubjectId);
  }

  function startFlow(
    event: ScheduleEventDto,
    flow: ActivityFlowDTO,
    targetSubjectId: string | null,
  ): void {
    const flowId = flow.id;

    const groupProgress = getProgress(flowId, event.id, targetSubjectId);

    if (isInProgress(groupProgress)) {
      return;
    }

    const flowActivities = flow.activityIds;

    if (flowActivities.length === 0) {
      throw new Error(
        `[useStartEntity:startFlow] Flow with id ${flowId} does not have any activities`,
      );
    }

    const firstActivityId: string = flowActivities[0];

    return flowStarted(flowId, firstActivityId, event, targetSubjectId, 0);
  }

  return { startActivity, startFlow };
};
