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
      return axiosService.get<AppletListSuccessResponse>("/applets?roles=respondent")
    },

    getById(payload: GetAppletByIdPayload) {
      return axiosService.get<AppletSuccessResponse>(`/applets/${payload.appletId}`)
    },
    getPublicByKey(payload: GetPublicAppletByIdPayload) {
      return axiosService.get<AppletSuccessResponse>(`/public/applets/${payload.publicAppletKey}`)
    },
    getPublicAppletActivityById(payload: GetPublicAppletActivityByIdPayload) {
      return axiosService.get(`/public/applet/${payload.publicAppletKey}/activity/${payload.activityId}`)
    },
  }
}

export default appletService()
