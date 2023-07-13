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
  | "time"
  | "sliderRows"
  | "singleSelectRows"
  | "multiSelectRows"
  | "audio"
  | "audioPlayer"
  | "unsupportable"
  | "splashScreen"

export type ItemCardButtonsConfig = {
  isBackShown: boolean
  isSkippable: boolean
  isNextDisabled: boolean
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
  | MessageItemConfig
  | DateItemConfig
  | TimeItemItemConfig
  | TimeRangeItemConfig

export type ResponseValues =
  | TextValues
  | CheckboxValues
  | RadioValues
  | SliderValues
  | SelectorValues
  | SplashScreenItemValues
  | MessageItemValues
  | DateItemValues
  | TimeItemValues
  | TimeRangeItemValues

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

export interface MessageItem extends ActivityItemBase {
  responseType: "message"
  config: MessageItemConfig
  responseValues: MessageItemValues
}

export type MessageItemConfig = ButtonsConfig
export type MessageItemValues = null

export interface DateItem extends ActivityItemBase {
  responseType: "date"
  config: DateItemConfig
  responseValues: DateItemValues
}

export type DateItemConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig
export type DateItemValues = null

export interface TimeItem extends ActivityItemBase {
  responseType: "time"
  config: TimeItemItemConfig
  responseValues: TimeItemValues
}

export type TimeItemItemConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig
export type TimeItemValues = null

export interface TimeRangeItem extends ActivityItemBase {
  responseType: "timeRange"
  config: TimeRangeItemConfig
  responseValues: TimeRangeItemValues
}

export type TimeRangeItemConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig
export type TimeRangeItemValues = null
