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
  Radio = "singleSelect",
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

export interface ActivityItemBase {
  id: string
  name: string
  question: string
  order: number
  answer: string[]
  responseType: ActivityItemType
  config: Config
  responseValues: ResponseValues
}

export type Config = TextItemConfig | CheckboxItemConfig | RadioItemConfig
export type ResponseValues = TextItemResponseValues | CheckboxValues | RadioValues

export interface TextItem extends ActivityItemBase {
  responseType: "text"
  config: TextItemConfig
  responseValues: TextItemResponseValues
}

export type TextItemConfig = ButtonsConfig & {
  maxResponseLength: number // default 300
  correctAnswerRequired: boolean // default false
  correctAnswer: string // default ""
  numericalResponseRequired: boolean // default false
  responseDataIdentifier: string // default ""
  responseRequired: boolean // default false
}

export type TextItemResponseValues = null

export interface CheckboxItem extends ActivityItemBase {
  responseType: "multiSelect"
  config: CheckboxItemConfig
  responseValues: CheckboxValues
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

export interface RadioItem extends ActivityItemBase {
  responseType: "singleSelect"
  config: RadioItemConfig
  responseValues: RadioValues
}

export type RadioItemConfig = ButtonsConfig &
  TimerConfig &
  AdditionalResponseConfig & {
    randomizeOptions: boolean
    addScores: boolean
    setAlerts: boolean
    addTooltip: boolean
    setPalette: boolean
  }

export type RadioValues = {
  options: Array<{
    id: string
    text: string
    image: string | null
    score: number | null
    tooltip: string | null
    isHidden: boolean
  }>
}
