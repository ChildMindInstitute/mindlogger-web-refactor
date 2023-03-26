export type ActivityItemType = "text" | "slider" | "radio" | "checkbox"

export type ActivityItem = {
  id: string
  question: string

  responseType: ActivityItemType

  timer: number

  isSkippable: boolean
  isRandom: boolean
  isAbleToMoveToPrevious: boolean
  hasTextResponse: boolean
  ordering: number
}

export type ItemCardButtonsConfig = {
  isOnePageAssessment?: boolean
  isBackShown?: boolean
  isSubmitShown?: boolean
  isSkippable?: boolean
  isNextDisable?: boolean
}
