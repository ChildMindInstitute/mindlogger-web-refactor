export interface ItemBaseDTO {
  id: string
  question: string
  responseType: ItemResponseType
  answers: Record<string, unknown>
  colorPalette: string
  timer: number
  hasTokenValue: boolean
  isSkippable: boolean
  hasAlert: boolean
  hasScore: boolean
  isRandom: boolean
  isAbleToMoveToPrevious: boolean
  hasTextResponse: boolean
  ordering: number
}

type ItemResponseType = "text" | "slider" | "radio" | "checkbox" // Need to discus with BE team
