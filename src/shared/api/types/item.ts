import { ConditionalLogic } from "./conditionalLogiс"

export type ItemResponseTypeDTO =
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
  | "time"

export interface ItemDetailsBaseDTO {
  id: string
  name: string
  question: string
  order: number
  isHidden: boolean
  responseType: ItemResponseTypeDTO
  config: ConfigDTO
  responseValues: ResponseValuesDTO
  conditionalLogic: ConditionalLogic | null
}

export type ConfigDTO =
  | TextItemConfigDTO
  | CheckboxItemConfigDTO
  | RadioItemConfigDTO
  | SliderItemConfigDTO
  | SelectorItemConfigDTO
  | MessageItemConfigDTO
  | DateItemConfigDTO
  | TimeItemConfigDTO
  | TimeRangeItemConfigDTO
  | AudioPlayerItemConfigDTO

export type ResponseValuesDTO =
  | EmptyResponseValuesDTO
  | CheckboxItemResponseValuesDTO
  | RadioItemResponseValuesDTO
  | SliderItemResponseValuesDTO
  | SelectorItemResponseValues
  | AudioPlayerItemResponseValuesDTO

export type EmptyResponseValuesDTO = null

export type AdditionalResponseOptionConfigDTO = {
  additionalResponseOption: {
    textInputOption: boolean
    textInputRequired: boolean
  }
}

export interface TextItemDTO extends ItemDetailsBaseDTO {
  responseType: "text"
  config: TextItemConfigDTO
  responseValues: EmptyResponseValuesDTO
}

export type TextItemConfigDTO = {
  maxResponseLength: number // default 300
  correctAnswerRequired: boolean // default false
  correctAnswer: string // default ""
  numericalResponseRequired: boolean // default ""
  responseDataIdentifier: boolean // default ""
  responseRequired: boolean // default false
  removeBackButton: boolean
  skippableItem: boolean
}

export interface CheckboxItemDTO extends ItemDetailsBaseDTO {
  responseType: "multiSelect"
  config: CheckboxItemConfigDTO
  responseValues: CheckboxItemResponseValuesDTO
}

export type CheckboxItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean
  skippableItem: boolean
  randomizeOptions: boolean
  timer: number | null
  addScores: boolean
  setAlerts: boolean
  addTooltip: boolean
  setPalette: boolean
}

export type CheckboxItemResponseValuesDTO = {
  options: Array<{
    id: string
    text: string
    image: string | null
    score: number | null
    tooltip: string | null
    color: string | null
    isHidden: boolean
    alert: string | null
    value: number
  }>
}

export interface RadioItemDTO extends ItemDetailsBaseDTO {
  responseType: "singleSelect"
  config: RadioItemConfigDTO
  responseValues: RadioItemResponseValuesDTO
}

export type RadioItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean
  skippableItem: boolean
  randomizeOptions: boolean
  timer: number | null
  addScores: boolean
  setAlerts: boolean
  addTooltip: boolean
  setPalette: boolean
  autoAdvance: boolean
}

export type RadioItemResponseValuesDTO = {
  options: Array<{
    id: string
    text: string
    image: string | null
    score: number | null
    tooltip: string | null
    color: string | null
    isHidden: boolean
    alert: string | null
    value: number
  }>
}

export interface SliderItemDTO extends ItemDetailsBaseDTO {
  responseType: "slider"
  config: SliderItemConfigDTO
  responseValues: SliderItemResponseValuesDTO
}

export type SliderItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  addScores: boolean
  setAlerts: boolean
  showTickMarks: boolean
  showTickLabels: boolean
  continuousSlider: boolean
  removeBackButton: boolean
  skippableItem: boolean
  timer: number | null
}

export type SliderItemResponseValuesDTO = {
  minLabel: string | null
  maxLabel: string | null
  minValue: number
  maxValue: number
  minImage: string | null
  maxImage: string | null
  scores: Array<number> | null
  alerts: Array<{
    value: number
    minValue: number
    maxValue: number
    alert: string
  }> | null
}

export interface SelectorItemDTO extends ItemDetailsBaseDTO {
  responseType: "numberSelect"
  config: SelectorItemConfigDTO
  responseValues: SelectorItemResponseValues
}

export type SelectorItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean
  skippableItem: boolean
}

export type SelectorItemResponseValues = {
  minValue: number
  maxValue: number
}

export interface MessageItemDTO extends ItemDetailsBaseDTO {
  responseType: "message"
  config: MessageItemConfigDTO
  responseValues: EmptyResponseValuesDTO
}

export type MessageItemConfigDTO = {
  removeBackButton: boolean
  timer: number | null
}

export interface DateItemDTO extends ItemDetailsBaseDTO {
  responseType: "date"
  config: DateItemConfigDTO
  responseValues: EmptyResponseValuesDTO
}

export type DateItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean
  skippableItem: boolean
  timer: number | null
}

export interface TimeItemDTO extends ItemDetailsBaseDTO {
  responseType: "time"
  config: TimeItemConfigDTO
  responseValues: EmptyResponseValuesDTO
}

export type TimeItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean
  skippableItem: boolean
  timer: number | null
}

export interface TimeRangeItemDTO extends ItemDetailsBaseDTO {
  responseType: "timeRange"
  config: TimeRangeItemConfigDTO
  responseValues: EmptyResponseValuesDTO
}

export type TimeRangeItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean
  skippableItem: boolean
  timer: number | null
}

export interface AudioPlayerItemDTO extends ItemDetailsBaseDTO {
  responseType: "audioPlayer"
  config: AudioPlayerItemConfigDTO
  responseValues: AudioPlayerItemResponseValuesDTO
}

export type AudioPlayerItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  playOnce: boolean
  removeBackButton: boolean
  skippableItem: boolean
}

export type AudioPlayerItemResponseValuesDTO = {
  file: string
}
