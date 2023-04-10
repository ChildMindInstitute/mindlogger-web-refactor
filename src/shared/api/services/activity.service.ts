import { AnswerPayload, GetActivityByIdPayload, SuccessResponseActivityById } from "../types"
import axiosService from "./axios"

function activityService() {
  return {
    getById(payload: GetActivityByIdPayload) {
      return axiosService.get<SuccessResponseActivityById>(`/activities/${payload.activityId}`)
    },
    saveAnswers(payload: AnswerPayload) {
      return axiosService.post(`/answers`, payload)
    },
  }
}

export default activityService()
