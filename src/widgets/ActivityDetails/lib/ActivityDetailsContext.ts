import { createContext } from "react"

type PrivateActivityAssessmentProps = {
  isPublic: false

  appletId: string
  activityId: string
  eventId: string
}

type PublicActivityAssessmentProps = {
  isPublic: true

  appletId: string
  activityId: string
  eventId: string

  publicAppletKey: string
}

type Context = PrivateActivityAssessmentProps | PublicActivityAssessmentProps

export const ActivityDetailsContext = createContext<Context>({} as Context)
