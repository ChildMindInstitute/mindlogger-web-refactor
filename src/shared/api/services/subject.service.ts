import { axiosService } from '~/shared/api';
import {
  GetMySubjectByAppletIdPayload,
  GetMySubjectSuccessResponse,
  GetSubjectByIdPayload,
  GetSubjectSuccessResponse,
} from '~/shared/api/types/subject';

function subjectService() {
  return {
    getSubjectById(payload: GetSubjectByIdPayload) {
      return axiosService.get<GetSubjectSuccessResponse>(`/subjects/${payload.subjectId}`);
    },

    getMySubjectByAppletId(payload: GetMySubjectByAppletIdPayload) {
      return axiosService.get<GetMySubjectSuccessResponse>(
        `/users/me/subjects/${payload.appletId}`,
      );
    },
  };
}

export default subjectService();
