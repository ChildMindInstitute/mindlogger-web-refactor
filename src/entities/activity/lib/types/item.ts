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
  responseType: ActivityItemType
  config: Config
  responseValues: ResponseValues
  answer: string[]
}

export type Config = TextItemConfig | CheckboxItemConfig | RadioItemConfig | SliderItemConfig
export type ResponseValues = TextValues | CheckboxValues | RadioValues | SliderValues

export interface TextItem extends ActivityItemBase {
  responseType: "text"
  config: TextItemConfig
  responseValues: TextValues
}

export type TextItemConfig = ButtonsConfig & {
  maxResponseLength: number // default 300
  correctAnswerRequired: boolean // default false
  correctAnswer: string // default ""
  numericalResponseRequired: boolean // default false
  responseDataIdentifier: string // default ""
  responseRequired: boolean // default false
}

export type TextValues = null

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

export interface SliderItem extends ActivityItemBase {
  responseType: "slider"
  config: SliderItemConfig
  responseValues: SliderValues
}

export type SliderItemConfig = ButtonsConfig &
  TimerConfig &
  AdditionalResponseConfig & {
    addScores: boolean
    setAlerts: boolean
    showTickMarks: boolean
    showTickLabels: boolean
    continuousSlider: boolean
  }

export type SliderValues = {
  minLabel: string | null
  maxLabel: string | null
  minValue: number
  maxValue: number
  minImage: string | null
  maxImage: string | null
}
