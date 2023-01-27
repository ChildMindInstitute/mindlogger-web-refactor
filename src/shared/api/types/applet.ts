import { BaseSuccessListResponse } from "./base"

export type AppletListSuccessResponse = BaseSuccessListResponse<{
  id: number | string
  displayName: string
  version: string
  description: {
    en: string
    fr: string
  }
  about: {
    en: string
    fr: string
  }
  image: string
  watermark: string
  themeId: string | number | null
  reportServerIp: string
  reportPublicKey: string
  reportRecipients: []
  reportIncludeUserId: boolean
  reportIncludeCaseId: boolean
  reportEmailBody: string
  activities: []
  activityFlows: []
}>
