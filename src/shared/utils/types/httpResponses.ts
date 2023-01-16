export interface BaseSuccessResponse<T> {
  result: T
}

export interface BaseErrorResponse {
  type: string
  message: string
}
