export type ActivityFlow = {
  id: string
  guid: string
  name: string
  description: string
  image: string | ""
  isSingleReport: boolean
  hideBadge: boolean
  ordering: number
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
  activities: TActivity[]
  activityFlows: TActivityFlow[]
}
