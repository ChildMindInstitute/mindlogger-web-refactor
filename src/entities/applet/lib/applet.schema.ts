import { ActivityBase } from "../../activity"

type ActivityFlowSchema = {
  id: string
  guid: string
  name: string
  description: string
  isSingleReport: boolean
  hideBadge: boolean
  ordering: number
  activityIds: string[]
}

export type AppletBase = {
  id: string
  displayName: string
  description: string
  about: string
  image?: string
  watermark?: string
}

export type AppletDetails = AppletBase & {
  activities: ActivityBase[]
  activityFlows: ActivityFlowSchema[]
}
