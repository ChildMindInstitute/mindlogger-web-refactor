import { answerService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof answerService.validateMultiInformantAssessment;
type Options<TData> = QueryOptions<FetchFn, TData>;
type OptionalArgs<TData = ReturnAwaited<FetchFn>> = {
  sourceSubjectId?: string;
  targetSubjectId?: string;
  activityOrFlowId?: string;
  options?: Options<TData>;
};

export const useValidateMultiInformantAssessmentQuery = <TData = ReturnAwaited<FetchFn>>(
  appletId: string,
  optionalArgs?: OptionalArgs<TData>,
) => {
  const { options, ...queryParams } = optionalArgs || {};

  return useBaseQuery(
    ['multiInformantAssessmentDetails', { appletId }],
    () => answerService.validateMultiInformantAssessment({ appletId, ...queryParams }),
    options,
  );
};
