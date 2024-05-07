import { appletService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof appletService.getAll;
type Params = {
  userId: string;
};
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useAppletListQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery([`appletList/${params.userId}`], appletService.getAll, { ...options });
};
