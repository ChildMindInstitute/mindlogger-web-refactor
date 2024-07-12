type ActivityIdsExtractorParams = {
  isFlow: boolean;
  currentActivityId: string;
  flowActivityIds: string[] | null;
};

export const extractActivityIdsToSubmitByParams = (
  params: ActivityIdsExtractorParams,
): string[] => {
  if (!params.isFlow) {
    return [params.currentActivityId];
  }

  if (!params.flowActivityIds) {
    throw new Error(
      '[CompletionContructService:extractActivityIdsToSubmitByParams] Flow activity ids are not defined',
    );
  }

  const interruptedActivityId = params.currentActivityId;

  const lastActivityId = params.flowActivityIds[params.flowActivityIds.length - 1];

  const isInterruptedActivityLast = interruptedActivityId === lastActivityId;

  const activitiesToSubmit = [interruptedActivityId];

  if (!isInterruptedActivityLast) {
    activitiesToSubmit.push(lastActivityId);
  }

  return activitiesToSubmit;
};
