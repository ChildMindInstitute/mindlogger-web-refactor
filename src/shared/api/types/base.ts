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
  response: { data: { results: Array<Result> } }
  evaluatedMessage?: string
}

export interface BaseSuccessResponse<T> {
  result: T
}

export interface BaseSuccessListResponse<T> {
  results: Array<T>
}
