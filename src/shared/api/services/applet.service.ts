import { AppletListSuccessResponse, AppletSuccessResponse, GetAppletDetailsByIdPayload } from "../types/applet"
import axiosService from "./axios"

function appletService() {
  return {
    getAll() {
      return axiosService.get<AppletListSuccessResponse>("/applets")
    },

    getById(payload: GetAppletDetailsByIdPayload) {
      return axiosService.get<AppletSuccessResponse>(`/applets/${payload.appletId}`)
    },
  }
}

export default appletService()
