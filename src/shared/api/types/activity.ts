import { BaseSuccessResponse } from "./base"
import { CheckboxItemDTO, RadioItemDTO, SliderItemDTO, TextItemDTO } from "./item"

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
  items: ActivityItemDetailsDTO[]
}

export type ActivityItemDetailsDTO = TextItemDTO | CheckboxItemDTO | RadioItemDTO | SliderItemDTO
