import { BaseSuccessResponse } from "./base"
import { ItemBaseDTO } from "./item"

export interface GetActivityByIdPayload {
  activityId: string
}

export type SuccessResponseActivityById = BaseSuccessResponse<ActivityDetailsDto>

export interface ActivityDetailsDto {
  id: string
  guid: string
  name: string
  description: string
  splashScreen: string
  image: string
  showAllAtOnce: boolean
  isSkippable: boolean
  isReviewable: boolean
  responseIsEditable: boolean
  ordering: number
  items: ItemBaseDTO[]
}
