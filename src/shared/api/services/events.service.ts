import { GetEventsByAppletIdPayload, SuccessEventsByAppletIdResponse } from "../types"
import axiosService from "./axios"

function eventService() {
  return {
    getEventsByAppletId(payload: GetEventsByAppletIdPayload) {
      return axiosService.get<SuccessEventsByAppletIdResponse>(`/users/me/events/${payload.appletId}`)
    },
    getUserEvents() {
      return axiosService.get<SuccessEventsByAppletIdResponse>("/users/me/events")
    },
  }
}

export default eventService()
