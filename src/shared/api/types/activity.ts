import { BaseSuccessResponse } from "./base"
import { ItemBaseDTO } from "./item"

export interface GetActivityByIdPayload {
  activityId: string
}

export type SuccessResponseActivityById = BaseSuccessResponse<ActivityBaseDTO>

export type ActivityBaseDTO = {
  id: string
  guid: string
  name: string
  description: string
  splashScreen?: string
  image?: string
  showAllAtOnce: boolean
  isSkippable: boolean
  isReviewable: boolean
  responseIsEditable: boolean
  ordering: number
  items: ItemBaseDTO[]
}
