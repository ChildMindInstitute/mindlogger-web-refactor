import axiosService from './axios';
import {
  AnswerPayload,
  CompletedEntitiesDTOSuccessResponse,
  GetCompletedEntitiesPayload,
  SuccessResponseActivityById,
} from '../types';

function activityService() {
  return {
    getById(id: string, params?: { version?: string }) {
      return axiosService.get<SuccessResponseActivityById>(`/activities/${id}`, {
        params,
      });
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
          params: {
            version: payload.version,
            fromDate: payload.fromDate,
            includeInProgress: payload.includeInProgress,
          },
        },
      );
    },
  };
}

export default activityService();
