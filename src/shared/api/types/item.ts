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

export interface ItemDetailsBaseDTO<Config, ResponseValues> {
  id: string
  name: string
  question: string
  responseType: ItemResponseTypeDTO
  responseValues: ResponseValues | null
  config: Config
  order: number
}

export type TextItemDTO = ItemDetailsBaseDTO<TextItemConfigDTO, null>

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

export type CheckboxItemDTO = ItemDetailsBaseDTO<CheckboxItemConfigDTO, CheckboxItemResponseValuesDTO>

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
  options: [{ text: string; image: string; score: number; tooltip: string; isHidden: boolean }]
}
