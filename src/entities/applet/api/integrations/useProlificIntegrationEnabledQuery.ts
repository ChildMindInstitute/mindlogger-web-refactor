import { ProlificService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof ProlificService.isProlificStudyValidated;
type Options<TData> = QueryOptions<FetchFn, TData>;

type PublicParams = {
  isPublic: true;
  publicAppletKey: string;
};

type PrivateParams = {
  isPublic: false;
  appletId: string;
};

export const useProlificStudyStateQuery = <TData = ReturnAwaited<FetchFn>>(
  params: (PublicParams | PrivateParams) & { prolificStudyId: null | string },
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['prolificStudyValidated', params],
    () => {
      if (params.isPublic) {
        return ProlificService.isProlificStudyValidated(
          params.publicAppletKey,
          params.prolificStudyId ?? undefined,
        );
      }
      return ProlificService.isProlificStudyValidated(params.appletId);
    },
    options,
  );
};
