import { MutationOptions, OneUpHealthService, useBaseMutation } from '~/shared/api';

type MutateFn = typeof OneUpHealthService.refreshToken;
type Options = MutationOptions<MutateFn>;

export const useOneUpHealthRefreshTokenMutation = (options?: Options) => {
  return useBaseMutation(
    ['oneUpHealthRefreshToken'],
    (params: Parameters<MutateFn>[0]) => OneUpHealthService.refreshToken(params),
    options,
  );
};
