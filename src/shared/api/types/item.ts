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

export interface ItemDetailsBaseDTO {
  id: string
  name: string
  question: string
  order: number
  responseType: ItemResponseTypeDTO
  config: ConfigDTO
  responseValues: ResponseValuesDTO
}

export type ConfigDTO = TextItemConfigDTO | CheckboxItemConfigDTO | RadioItemConfigDTO
export type ResponseValuesDTO = TextItemResponseValuesDTO | CheckboxItemResponseValuesDTO | RadioItemResponseValuesDTO

export interface TextItemDTO extends ItemDetailsBaseDTO {
  responseType: "text"
  config: TextItemConfigDTO
  responseValues: TextItemResponseValuesDTO
}

export type TextItemConfigDTO = {
  maxResponseLength: number // default 300
  correctAnswerRequired: boolean // default false
  correctAnswer: string // default ""
  numericalResponseRequired: boolean // default ""
  responseDataIdentifier: string // default ""
  responseRequired: boolean // default false
  removeBackButton: boolean
  skippableItem: boolean
}

export type TextItemResponseValuesDTO = null

export interface CheckboxItemDTO extends ItemDetailsBaseDTO {
  responseType: "multiSelect"
  config: CheckboxItemConfigDTO
  responseValues: CheckboxItemResponseValuesDTO
}

export type CheckboxItemConfigDTO = {
  removeBackButton: boolean
  skippableItem: boolean
  randomizeOptions: boolean
  timer: number | null
  addScores: boolean
  setAlerts: boolean
  addTooltip: boolean
  setPalette: boolean
  additionalResponseOption: {
    textInputOption: boolean
    textInputRequired: boolean
  }
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
  }>
}

export interface RadioItemDTO extends ItemDetailsBaseDTO {
  responseType: "singleSelect"
  config: RadioItemConfigDTO
  responseValues: RadioItemResponseValuesDTO
}

export type RadioItemConfigDTO = {
  removeBackButton: boolean
  skippableItem: boolean
  randomizeOptions: boolean
  timer: number | null
  addScores: boolean
  setAlerts: boolean
  addTooltip: boolean
  setPalette: boolean
  additionalResponseOption: {
    textInputOption: boolean
    textInputRequired: boolean
  }
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
  }>
}
