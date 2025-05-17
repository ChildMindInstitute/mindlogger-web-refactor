import { axiosService, BaseSuccessResponse } from '~/shared/api';

type OneUpHealthTokenParams = {
  appletId: string;
  submitId: string;
  activityId: string;
};

type OneUpHealthRefreshTokenParams = {
  refreshToken: string;
};

type OneUpHealthToken = BaseSuccessResponse<{
  accessToken: string;
  refreshToken: string;
  appUserId: string;
  oneupUserId: number;
}>;

type OneUpHealthRefreshedToken = BaseSuccessResponse<{
  accessToken: string;
  refreshToken: string;
}>;
const getOneUpHealthService = () => {
  return {
    retrieveTokenBySubmitId: ({ appletId, submitId, activityId }: OneUpHealthTokenParams) =>
      axiosService.get<OneUpHealthToken>(
        `/integrations/oneup_health/applet/${appletId}/submission/${submitId}/activity/${activityId}/token`,
      ),
    refreshToken: ({ refreshToken }: OneUpHealthRefreshTokenParams) =>
      axiosService.post<OneUpHealthRefreshedToken>('/integrations/oneup_health/refresh_token', {
        refresh_token: refreshToken,
      }),
  };
};

export default getOneUpHealthService();
