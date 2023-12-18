import { actions } from "~/entities/activity/model"
import { AppletDetailsDTO } from "~/shared/api"
import { useAppDispatch } from "~/shared/utils"

type Props = {
  appletDetails: AppletDetailsDTO
}

const AVAILABLE_INTEGRATIONS = ["loris"]

export const useIntegrationsSync = ({ appletDetails }: Props) => {
  const dispatch = useAppDispatch()

  const isLorisIntegrationAvailable = appletDetails.integrations.some(integration =>
    AVAILABLE_INTEGRATIONS.includes(integration),
  )

  if (isLorisIntegrationAvailable) {
    dispatch(actions.applyDataSharingSettings({ appletId: appletDetails.id }))
  }
}
