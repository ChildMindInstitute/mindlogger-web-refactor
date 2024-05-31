import { AxiosError } from 'axios';

import { answerService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof answerService.validateMultiInformantAssessment;
type ReturnType = ReturnAwaited<FetchFn>;
type OptionalArgs = {
  sourceSubjectId?: string;
  targetSubjectId?: string;
  activityOrFlowId?: string;
  options?: QueryOptions<FetchFn, ReturnType, ReturnType, AxiosError>;
};

export const useValidateMultiInformantAssessmentQuery = (
  appletId: string,
  optionalArgs?: OptionalArgs,
) => {
  const { options, ...queryParams } = optionalArgs || {};

  return useBaseQuery<
    ReturnAwaited<typeof answerService.validateMultiInformantAssessment>,
    AxiosError,
    ReturnAwaited<typeof answerService.validateMultiInformantAssessment>
  >(
    ['multiInformantAssessmentDetails', { appletId }],
    () => answerService.validateMultiInformantAssessment({ appletId, ...queryParams }),
    options,
  );
};
