import axiosService from './axios';
import {
  AnswerPayload,
  CompletedEntitiesDTOSuccessResponse,
  GetCompletedEntitiesPayload,
  SuccessResponseActivityById,
} from '../types';

function activityService() {
  return {
    getById(id: string) {
      return axiosService.get<SuccessResponseActivityById>(`/activities/${id}`);
    },
    saveAnswers(payload: AnswerPayload) {
      return axiosService.post(`/answers`, payload);
    },
    getPublicById(id: string) {
      return axiosService.get<SuccessResponseActivityById>(`/public/activities/${id}`);
    },
    publicSaveAnswers(payload: AnswerPayload) {
      return axiosService.post<CompletedEntitiesDTOSuccessResponse>(`/public/answers`, payload);
    },

    getCompletedEntities(payload: GetCompletedEntitiesPayload) {
      return axiosService.get<CompletedEntitiesDTOSuccessResponse>(
        `/answers/applet/${payload.appletId}/completions`,
        {
          params: { version: payload.version, fromDate: payload.fromDate },
        },
      );
    },
  };
}

export default activityService();
