import { BaseSuccessResponse } from "./base"

export interface GetActivityByIdPayload {
  activityId: string
}

export type SuccessResponseActivityById = BaseSuccessResponse<ActivityDTO>

export type ActivityDTO = {
  id: string
  guid: string
  name: string
  description: string
  splashScreen: string | ""
  image: string | ""
  showAllAtOnce: boolean
  isSkippable: boolean
  isReviewable: boolean
  responseIsEditable: boolean
  ordering: number
  items: ItemDetailsDTO[]
}

export interface ItemDetailsDTO {
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

type ItemResponseType = "text" | "slider" | "radio" | "checkbox"
