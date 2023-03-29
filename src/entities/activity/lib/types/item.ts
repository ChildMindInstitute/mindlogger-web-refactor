export type ActivityItemType =
  | "text"
  | "singleSelect"
  | "multiSelect"
  | "message"
  | "slider"
  | "numberSelect"
  | "timeRange"
  | "geolocation"
  | "drawing"
  | "photo"
  | "video"
  | "date"
  | "sliderRows"
  | "singleSelectRows"
  | "multiSelectRows"
  | "audio"
  | "audioPlayer"
  | "unsupportable"

export enum SupportableActivityItemType {
  Text = "text",
  Checkbox = "multiSelect",
  Unsupportable = "unsupportable",
}

export type ItemCardButtonsConfig = {
  isOnePageAssessment?: boolean
  isBackShown?: boolean
  isSubmitShown?: boolean
  isSkippable?: boolean
  isNextDisable?: boolean
}

export type ButtonsConfig = {
  removeBackButton: boolean
  skippableItem: boolean
}

export type TimerConfig = {
  timer: number | null
}

export type AdditionalResponseConfig = {
  additionalResponseOption: {
    textInputOption: boolean
    textInputRequired: boolean
  }
}

export type ActivityItem<Type = unknown, Config = unknown, ResponseValues = unknown> = {
  id: string
  name: string
  question: string
  responseType: Type
  responseValues: ResponseValues
  order: number
  config: Config
  answer: string[]
}

export type TextItemConfig = ButtonsConfig & {
  maxResponseLength: number // default 300
  correctAnswerRequired: boolean // default false
  correctAnswer: string // default ""
  numericalResponseRequired: boolean // default false
  responseDataIdentifier: string // default ""
  responseRequired: boolean // default false
}

export type CheckboxItemConfig = ButtonsConfig &
  TimerConfig &
  AdditionalResponseConfig & {
    randomizeOptions: boolean
    addScores: boolean
    setAlerts: boolean
    addTooltip: boolean
    setPalette: boolean
  }

export type CheckboxValues = {
  options: Array<{
    id: string
    text: string
    image: string | null
    score: number | null
    tooltip: string | null
    isHidden: boolean
  }>
}
