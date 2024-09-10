import { axiosService } from '~/shared/api';
import { GetMyAssignmentsPayload, MyAssignmentsSuccessResponse } from '~/shared/api/types';

function subjectService() {
  return {
    getMyAssignments({ appletId }: GetMyAssignmentsPayload) {
      return axiosService.get<MyAssignmentsSuccessResponse>(`/users/me/assignments/${appletId}`);
    },
  };
}

export default subjectService();
