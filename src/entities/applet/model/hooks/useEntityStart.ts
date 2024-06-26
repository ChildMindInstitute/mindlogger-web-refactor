import { useGroupProgressState } from './useGroupProgressState';
import { actions } from '../slice';

import { GroupProgress } from '~/abstract/lib';
import { ActivityFlowDTO } from '~/shared/api';
import { useAppDispatch } from '~/shared/utils';

type StartSurveyPayload = {
  eventId: string;
  activityId: string;
  flow: ActivityFlowDTO | null;
};

export const useEntityStart = () => {
  const dispatch = useAppDispatch();

  const { getGroupProgress } = useGroupProgressState();

  const isInProgress = (payload: GroupProgress | null): boolean => !!payload && !payload.endAt;

  function activityStarted(activityId: string, eventId: string): void {
    dispatch(
      actions.activityStarted({
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
    const isActivityInProgress = isInProgress(getGroupProgress({ entityId: activityId, eventId }));

    if (isActivityInProgress) {
      return;
    }

    return activityStarted(activityId, eventId);
  }

  function startFlow(eventId: string, flow: ActivityFlowDTO): void {
    const flowActivities: string[] | null = flow.activityIds ?? null;

    if (!flowActivities) {
      throw new Error(
        `[useStartEntity:startFlow] Flow with id ${flow.id} does not have any activities`,
      );
    }

    const firstActivityId: string = flowActivities[0];

    return flowStarted(flow.id, firstActivityId, eventId, 0);
  }

  function startSurvey({ eventId, activityId, flow }: StartSurveyPayload): void {
    const entityId = flow?.id ?? activityId;

    const groupProgress = getGroupProgress({ entityId, eventId });

    const isSurveyInProgress = isInProgress(groupProgress);

    const isFlow = !!flow;

    if (isFlow && !isSurveyInProgress) {
      return startFlow(eventId, flow);
    }

    if (!isFlow && !isSurveyInProgress) {
      return startActivity(activityId, eventId);
    }
  }

  return { startSurvey };
};
