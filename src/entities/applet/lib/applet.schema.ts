import { AppletEncryptionDTO } from "../../../shared/api"

export type ActivityFlow = {
  id: string
  name: string
  description: string
  image: string | ""
  isSingleReport: boolean
  hideBadge: boolean
  order: number
  activityIds: string[]
}

export type AppletListItem = {
  id: string
  displayName: string
  description: string
  about: string
  image: string | ""
  watermark: string | ""
}

export type AppletDetails<TActivity, TActivityFlow> = {
  id: string
  displayName: string
  description: string
  about: string
  image: string | ""
  watermark: string | ""
  version: string
  activities: TActivity[]
  activityFlows: TActivityFlow[]
  encryption: AppletEncryptionDTO | null
}
