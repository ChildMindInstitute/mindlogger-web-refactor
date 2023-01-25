import { AppletListSuccessResponse } from "../types/applet"
import axiosService from "./axios"

function appletService() {
  return {
    getAll() {
      return axiosService.get<AppletListSuccessResponse>("/applets")
    },
  }
}

export default appletService()
