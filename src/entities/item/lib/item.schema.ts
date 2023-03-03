export type ActivityItemType = "text" | "slider" | "radio" | "checkbox"

export type ActivityItem = {
  id: string
  question: string

  responseType: ActivityItemType
  answers: Record<string, unknown>

  timer: number

  isSkippable: boolean
  isRandom: boolean
  isAbleToMoveToPrevious: boolean
  hasTextResponse: boolean
  ordering: number
}
