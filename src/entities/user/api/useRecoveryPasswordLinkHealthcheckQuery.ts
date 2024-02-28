import { authorizationService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof authorizationService.recoveryLinkHealthCheck;
type Options<TData> = QueryOptions<FetchFn, TData>;

type Params = {
  email: string;
  key: string;
};

export const useRecoveryPasswordLinkHealthcheckQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['recoveryPasswordLinkHealthcheck', { ...params }],
    () => authorizationService.recoveryLinkHealthCheck(params),
    options,
  );
};
