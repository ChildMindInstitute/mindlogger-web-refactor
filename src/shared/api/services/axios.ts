import axios, { AxiosError, AxiosRequestConfig } from "axios"

import { eventEmitter, secureTokensStorage } from "../../utils"
import authorizationService from "./authorization.service"

type RequestConfig = AxiosRequestConfig<any> & {
  retry?: boolean
}

const axiosService = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
})

axiosService.defaults.headers.common["Content-Type"] = "application/json"

axiosService.interceptors.request.use(
  config => {
    const tokens = secureTokensStorage.getTokens()

    if (tokens?.accessToken && tokens?.tokenType) {
      config.headers!.Authorization = `${tokens.tokenType} ${tokens.accessToken}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

axiosService.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const config = error?.config as RequestConfig

    if (error.response?.status === 401 && !config?.retry) {
      config.retry = true

      const tokens = secureTokensStorage.getTokens()

      if (!tokens?.refreshToken || !tokens.tokenType) {
        return Promise.reject(error)
      }

      try {
        const { data } = await authorizationService.refreshToken({ refreshToken: tokens?.refreshToken })

        secureTokensStorage.setTokens(data.result)

        config.headers!.Authorization = `${data.result.tokenType} ${data.result.accessToken}`
      } catch (e) {
        eventEmitter.emit("onLogout")
        Promise.reject(e)
      }

      return axiosService(config)
    }

    return Promise.reject(error)
  },
)

export default axiosService
