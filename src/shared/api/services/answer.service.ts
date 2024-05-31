import { axiosService } from '~/shared/api';
import {
  ValidateMultiInformantAssessmentPayload,
  ValidateMultiInformantAssessmentResponse,
} from '~/shared/api/types/answer';

function answerService() {
  return {
    validateMultiInformantAssessment(payload: ValidateMultiInformantAssessmentPayload) {
      return axiosService.get<ValidateMultiInformantAssessmentResponse>(
        `/answers/applet/${payload.appletId}/multiinformant-assessment/validate`,
        {
          params: {
            sourceSubjectId: payload.sourceSubjectId,
            targetSubjectId: payload.targetSubjectId,
            activityOrFlowId: payload.activityOrFlowId,
          },
        },
      );
    },
  };
}

export default answerService();
