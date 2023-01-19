import axios from "axios"

const axiosService = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
})

axiosService.defaults.headers.common["Content-Type"] = "application/json"

export default axiosService
