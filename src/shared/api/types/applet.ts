import { MultiLang } from "../../utils"
import { BaseSuccessListResponse, BaseSuccessResponse } from "./base"

export type AppletListSuccessResponse = BaseSuccessListResponse<AppletResponse>
export type AppletSuccessResponse = BaseSuccessResponse<AppletResponse>

export type AppletResponse = {
  id: number | string
  displayName: string
  version: string
  description: MultiLang
  about: MultiLang
  image: string
  watermark: string
  themeId: string | number | null
  reportServerIp: string
  reportPublicKey: string
  reportRecipients: []
  reportIncludeUserId: boolean
  reportIncludeCaseId: boolean
  reportEmailBody: string
  activities: Activity[]
  activityFlows: []
}

export type Activity = {
  id: number | string
  guid: string
  name: string
  description: MultiLang
  splashScreen: string
  image: string
  showAllAtOnce: boolean
  isSkippable: boolean
  isReviewable: boolean
  responseIsEditable: boolean
  ordering: number
  items: []
}

export type ActivityFlow = {
  id: number | string
  guid: string
  name: string
  description: MultiLang
  isSingleReport: boolean
  hideBadge: boolean
  ordering: number
  items: Item[]
}

export type Item = {
  id: number | string
  activityFlowId: number | string
  activityId: number | string
  ordering: number
  activity: Activity
}
