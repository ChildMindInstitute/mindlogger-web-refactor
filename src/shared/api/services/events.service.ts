import { GetEventsByAppletIdPayload, SuccessEventsByAppletIdResponse } from "../types"
import axiosService from "./axios"

function eventService() {
  return {
    getEventsByAppletId(payload: GetEventsByAppletIdPayload) {
      return axiosService.get<SuccessEventsByAppletIdResponse>(`/applets/${payload.appletId}/events`)
    },
  }
}

export default eventService()
