import {
  AppletListSuccessResponse,
  AppletSuccessResponse,
  GetAppletDetailsByIdPayload,
  GetPublicAppletActivityByIdPayload,
  GetPublicAppletDetailsByIdPayload,
} from "../types/applet"
import axiosService from "./axios"

function appletService() {
  return {
    getAll() {
      return axiosService.get<AppletListSuccessResponse>("/applets")
    },

    getById(payload: GetAppletDetailsByIdPayload) {
      return axiosService.get<AppletSuccessResponse>(`/applets/${payload.appletId}`)
    },
    getPublicById(payload: GetPublicAppletDetailsByIdPayload) {
      return axiosService.get(`/public/applet/${payload.publicAppletKey}`)
    },
    getPublicAppletActivityById(payload: GetPublicAppletActivityByIdPayload) {
      return axiosService.get(`/public/applet/${payload.publicAppletKey}/activity/${payload.activityId}`)
    },
  }
}

export default appletService()
