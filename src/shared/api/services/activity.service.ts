import { AnswerPayload, GetActivityByIdPayload, GetPublicActivityById, SuccessResponseActivityById } from "../types"
import axiosService from "./axios"

function activityService() {
  return {
    getById(payload: GetActivityByIdPayload) {
      return axiosService.get<SuccessResponseActivityById>(`/activities/${payload.activityId}`)
    },
    saveAnswers(payload: AnswerPayload) {
      return axiosService.post(`/answers`, payload)
    },
    getPublicById(payload: GetPublicActivityById) {
      return axiosService.get<SuccessResponseActivityById>(`/public/activities/${payload.activityId}`)
    },
    publicSaveAnswers(payload: AnswerPayload) {
      return axiosService.post(`/public/answers`, payload)
    },
  }
}

export default activityService()
