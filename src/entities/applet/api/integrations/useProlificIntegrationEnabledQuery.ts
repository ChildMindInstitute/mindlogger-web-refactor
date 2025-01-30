import { ProlificService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof ProlificService.isProlificIntergrationEnabled;
type Options<TData> = QueryOptions<FetchFn, TData>;

type PublicParams = {
  isPublic: true;
  publicAppletKey: string;
};

type PrivateParams = {
  isPublic: false;
  appletId: string;
};

export const useProlificIntegrationStateQuery = <TData = ReturnAwaited<FetchFn>>(
  params: (PublicParams | PrivateParams) & { prolificStudyId: null | string },
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['prolificIntegrationEnabled', params],
    () => {
      if (params.isPublic) {
        return ProlificService.isProlificIntergrationEnabled(
          params.publicAppletKey,
          params.prolificStudyId ?? undefined,
        );
      }
      return ProlificService.isProlificIntergrationEnabled(params.appletId);
    },
    options,
  );
};
