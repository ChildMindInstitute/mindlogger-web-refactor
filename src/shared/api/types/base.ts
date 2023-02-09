interface Messages {
  en: string
}

interface Result {
  message: Messages
  path: string[]
  type: string
}

export type BaseError = {
  message?: string
  response: { data: { result: Array<Result> } }
  evaluatedMessage?: string
}

export interface BaseSuccessResponse<T> {
  result: T
}

export interface BaseSuccessListResponse<T> {
  result: Array<T>
}
