import { BaseSuccessResponse } from "./base"
import { Item } from "./item"

export interface GetActivityByIdPayload {
  activityId: string
}

export type SuccessResponseActivityById = BaseSuccessResponse<ResponseActivityById>

interface ResponseActivityById {
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
  items: Item[]
}
