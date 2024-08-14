import { appletModel } from '~/entities/applet';

type ActivityIdsExtractorParams = {
  isFlow: boolean;
  interruptedActivityId: string;

  interruptedActivityProgress: appletModel.ActivityProgress | null;
  flowActivityIds: string[] | null;
};
export const extractActivityIdsToSubmitByParams = (
  params: ActivityIdsExtractorParams,
): string[] => {
  if (!params.isFlow) {
    return [params.interruptedActivityId];
  }

  if (!params.flowActivityIds) {
    throw new Error(
      '[CompletionContructService:extractActivityIdsToSubmitByParams] Flow activity ids are not defined',
    );
  }

  const lastActivityId = params.flowActivityIds[params.flowActivityIds.length - 1];

  const isInterruptedActivityLast = params.interruptedActivityId === lastActivityId;

  const activitiesToSubmit = [];

  if (params.interruptedActivityProgress) {
    activitiesToSubmit.push(params.interruptedActivityId);
  }

  if (!isInterruptedActivityLast) {
    activitiesToSubmit.push(lastActivityId);
  }

  return activitiesToSubmit;
};
