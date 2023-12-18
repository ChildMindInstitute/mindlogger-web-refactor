import { useEffect } from "react"

import { AppletIntegrationsService } from "~/entities/activity/model/integrations"
import { AppletDetailsDTO } from "~/shared/api"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

type Props = {
  appletDetails: AppletDetailsDTO
}

const AVAILABLE_INTEGRATIONS = ["loris"]

export const useIntegrationsSync = ({ appletDetails }: Props) => {
  const dispatch = useAppDispatch()
  const rootState = useAppSelector(state => state)

  const isLorisIntegrationAvailable = appletDetails.integrations.some(integration =>
    AVAILABLE_INTEGRATIONS.includes(integration),
  )

  useEffect(() => {
    const appletIntegrationService = new AppletIntegrationsService(rootState, dispatch)

    if (isLorisIntegrationAvailable) {
      appletIntegrationService.applyIntegrations(appletDetails)
    }
  }, [appletDetails, dispatch, isLorisIntegrationAvailable, rootState])
}
