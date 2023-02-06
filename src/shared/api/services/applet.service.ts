import { AppletListSuccessResponse, AppletSuccessResponse } from "../types/applet"
import axiosService from "./axios"

function appletService() {
  return {
    getAll() {
      return axiosService.get<AppletListSuccessResponse>("/applets")
    },

    getById(id: string | number) {
      return axiosService.get<AppletSuccessResponse>(`/applets/${id}`)
    },
  }
}

export default appletService()
