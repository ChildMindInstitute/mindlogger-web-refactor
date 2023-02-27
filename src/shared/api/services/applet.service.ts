import {
  AppletListSuccessResponse,
  AppletSuccessResponse,
  GetAppletByIdPayload,
  GetPublicAppletActivityByIdPayload,
  GetPublicAppletByIdPayload,
} from "../types/applet"
import axiosService from "./axios"

function appletService() {
  return {
    getAll() {
      return axiosService.get<AppletListSuccessResponse>("/applets")
    },

    getById(payload: GetAppletByIdPayload) {
      return axiosService.get<AppletSuccessResponse>(`/applets/${payload.appletId}`)
    },
    getPublicById(payload: GetPublicAppletByIdPayload) {
      return axiosService.get<AppletSuccessResponse>(`/public/applet/${payload.publicAppletKey}`)
    },
    getPublicAppletActivityById(payload: GetPublicAppletActivityByIdPayload) {
      return axiosService.get(`/public/applet/${payload.publicAppletKey}/activity/${payload.activityId}`)
    },
  }
}

export default appletService()
