import { axiosService, BaseSuccessResponse } from '~/shared/api';

type OneUpHealthTokenParams = {
  appletId: string;
  submitId: string;
  activityId: string;
};

type OneUpHealthToken = BaseSuccessResponse<{
  accessToken: string;
  refreshToken: string;
  appUserId: string;
  oneupUserId: number;
}>;

const getOneUpHealthService = () => {
  return {
    retrieveTokenBySubmitId: ({ appletId, submitId, activityId }: OneUpHealthTokenParams) =>
      axiosService.get<OneUpHealthToken>(
        `/integrations/oneup_health/applet/${appletId}/submission/${submitId}/activity/${activityId}/token`,
      ),
  };
};

export default getOneUpHealthService();
