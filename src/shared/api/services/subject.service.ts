import { axiosService } from '~/shared/api';
import { GetSubjectByIdPayload, GetSubjectSuccessResponse } from '~/shared/api/types/subject';

function subjectService() {
  return {
    getSubjectById(payload: GetSubjectByIdPayload) {
      return axiosService.get<GetSubjectSuccessResponse>(`/subjects/${payload.subjectId}`);
    },
  };
}

export default subjectService();
