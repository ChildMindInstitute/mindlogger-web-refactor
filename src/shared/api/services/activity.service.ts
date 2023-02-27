import { GetActivityByIdPayload, SuccessResponseActivityById } from "../types"
import axiosService from "./axios"

function activityService() {
  return {
    getById(payload: GetActivityByIdPayload) {
      return axiosService.get<SuccessResponseActivityById>(`/activities/${payload.activityId}`)
    },
  }
}

export default activityService()