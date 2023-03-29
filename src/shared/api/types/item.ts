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

export interface ItemDetailsBaseDTO<ResponseType extends ItemResponseTypeDTO, Config, ResponseValues> {
  id: string
  name: string
  question: string
  responseType: ResponseType
  responseValues: ResponseValues
  config: Config
  order: number
}

export type TextItemDTO = ItemDetailsBaseDTO<"text", TextItemConfigDTO, null>

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

export type CheckboxItemDTO = ItemDetailsBaseDTO<"multiSelect", CheckboxItemConfigDTO, CheckboxItemResponseValuesDTO>

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

export type RadioItemDTO = ItemDetailsBaseDTO<"singleSelect", RadioItemConfigDTO, RadioItemResponseValuesDTO>

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

export type RadioItemDTO = ItemDetailsBaseDTO<"singleSelect", RadioItemConfigDTO, RadioItemResponseValuesDTO>

export type RadioItemConfigDTO = {
  randomizeOptions: boolean
  addScores: boolean
  setAlerts: boolean
  addTooltip: boolean
  setPalette: boolean
  removeBackButton: boolean
  skippableItem: boolean
  timer: number | null
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
