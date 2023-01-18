export type BaseError = {
  message?: string
  response: { data: { messages: string[] } }
  evaluatedMessage?: string
}

export interface BaseSuccessResponse<T> {
  result: T
}
