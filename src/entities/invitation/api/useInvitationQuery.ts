import { invitationService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof invitationService.getInvitationById;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useInvitationQuery = <TData = ReturnAwaited<FetchFn>>(invitationId: string, options?: Options<TData>) => {
  return useBaseQuery(
    ['invitationDetails', { invitationId }],
    () => invitationService.getInvitationById({ invitationId }),
    options,
  );
};
