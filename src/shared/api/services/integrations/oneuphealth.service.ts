import { axiosService, BaseSuccessResponse } from '~/shared/api';

type OneUpHealthTokenParams = {
  appletId: string;
  submitId: string;
};

type OneUpHealthToken = BaseSuccessResponse<{
  accessToken: string;
  refreshToken: string;
  subjectId: string;
  submitId: string;
  oneupUserId: number;
}>;

const getOneUpHealthService = () => {
  return {
    retrieveTokenBySubmitId: ({ appletId, submitId }: OneUpHealthTokenParams) =>
      axiosService.get<OneUpHealthToken>(
        `/integrations/oneup_health/applet/${appletId}/submissions/${submitId}/token`,
      ),
  };
};

export default getOneUpHealthService();
