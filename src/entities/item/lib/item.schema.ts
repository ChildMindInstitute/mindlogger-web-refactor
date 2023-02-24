export type ActivityItemType = "text" | "slider" | "radio" | "checkbox"

export type ActivityItem = {
  id: string
  question: string

  responseType: ActivityItemType

  isSkipable: boolean
  ordering: number
}
