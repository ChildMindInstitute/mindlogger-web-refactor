import { Axios, AxiosRequestConfig } from "axios"
import api from "./axios"

class Http {
  constructor(private axios: Axios) {}

  public GET(url: string, config?: AxiosRequestConfig) {
    return this.axios.get(url, config)
  }

  public POST<TData>(url: string, data?: TData, config?: AxiosRequestConfig) {
    return this.axios.post(url, data, config)
  }

  public PUT<TData>(url: string, data?: TData, config?: AxiosRequestConfig) {
    return this.axios.put(url, data, config)
  }

  public PATCH<TData>(url: string, data?: TData, config?: AxiosRequestConfig) {
    return this.axios.patch(url, data, config)
  }

  public DELETE(url: string, config?: AxiosRequestConfig) {
    return this.axios.delete(url, config)
  }
}

const httpService = new Http(api)

export default httpService
