import { eventsService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof eventsService.getEventsByAppletId;
type Options<TData> = QueryOptions<FetchFn, TData>;

type PublicParams = {
  isPublic: true;
  publicAppletKey: string;
};

type PrivateParams = {
  isPublic: false;
  appletId: string;
};

type Params = PublicParams | PrivateParams;

export const useEventsbyAppletIdQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['eventsByAppletId', { ...params }],
    () =>
      params.isPublic
        ? eventsService.getEventsByPublicAppletKey({ publicAppletKey: params.publicAppletKey })
        : eventsService.getEventsByAppletId({ appletId: params.appletId }),
    options,
  );
};
