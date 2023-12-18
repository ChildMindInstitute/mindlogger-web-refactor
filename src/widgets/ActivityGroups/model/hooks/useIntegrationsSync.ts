import { useEffect } from "react"

import { AppletIntegrationsService } from "~/entities/activity/model/integrations"
import { AppletDetailsDTO } from "~/shared/api"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

type Props = {
  appletDetails: AppletDetailsDTO
}

export const useIntegrationsSync = ({ appletDetails }: Props) => {
  const dispatch = useAppDispatch()
  const rootState = useAppSelector(state => state)

  useEffect(() => {
    const appletIntegrationService = new AppletIntegrationsService(rootState, dispatch)

    appletIntegrationService.applyIntegrations(appletDetails)
  }, [appletDetails, dispatch, rootState])
}
