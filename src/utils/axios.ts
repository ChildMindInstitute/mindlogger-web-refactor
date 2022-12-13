import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
})

api.defaults.headers.common["Content-Type"] = "application/json"

export default api
