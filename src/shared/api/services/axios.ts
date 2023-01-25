import axios from "axios"

import { secureTokensStorage } from "../../utils"

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

export default axiosService
