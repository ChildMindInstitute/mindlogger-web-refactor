import { createContext } from "react"

import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"

type AppletDetailsContextProps = {
  appletDetails: AppletDetailsDTO
  eventsDetails: AppletEventsResponse
}

type PublicAppletDetails = {
  isPublic: true
  publicAppletKey: string
}

type PrivateAppletDetails = {
  isPublic: false
  appletId: string
}

type Context = AppletDetailsContextProps & (PublicAppletDetails | PrivateAppletDetails)

export const AppletDetailsContext = createContext<Context>({} as Context)
