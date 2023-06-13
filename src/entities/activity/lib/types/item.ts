import { ConditionalLogic } from "~/shared/api"

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
  | "splashScreen"

export enum SupportableActivityItemType {
  Text = "text",
  Checkbox = "multiSelect",
  Radio = "singleSelect",
  Unsupportable = "unsupportable",
}

export type ItemCardButtonsConfig = {
  isBackShown: boolean
  isSkippable: boolean
  isNextDisable: boolean
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

export type Answer = Array<string>
export type Answers = Array<Answer>

export interface ActivityItemBase {
  id: string
  name: string
  question: string
  order: number
  responseType: ActivityItemType
  config: Config
  responseValues: ResponseValues
  answer: Answer
  conditionalLogic: ConditionalLogic | null
}

export type Config =
  | TextItemConfig
  | CheckboxItemConfig
  | RadioItemConfig
  | SliderItemConfig
  | SelectorItemConfig
  | SplashScreenItemConfig
export type ResponseValues =
  | TextValues
  | CheckboxValues
  | RadioValues
  | SliderValues
  | SelectorValues
  | SplashScreenItemValues

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
  responseDataIdentifier: boolean // default false
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
    color: string | null
    isHidden: boolean
    value: number
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
    color: string | null
    isHidden: boolean
    value: number
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

export interface SelectorItem extends ActivityItemBase {
  responseType: "numberSelect"
  config: SelectorItemConfig
  responseValues: SelectorValues
}

export type SelectorItemConfig = ButtonsConfig & AdditionalResponseConfig
export type SelectorValues = {
  minValue: number
  maxValue: number
}

export interface SplashScreenItem extends ActivityItemBase {
  responseType: "splashScreen"
  config: SplashScreenItemConfig
  responseValues: SplashScreenItemValues
}

export type SplashScreenItemConfig = ButtonsConfig & {
  imageSrc: string
}
export type SplashScreenItemValues = null
