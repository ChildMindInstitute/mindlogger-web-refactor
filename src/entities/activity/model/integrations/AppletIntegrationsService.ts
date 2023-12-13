import LorisAppletIntegration from "./LorisAppletIntegration"

import { AppletDetailsDTO } from "~/shared/api"
import { AppDispatch, RootState } from "~/shared/utils"

export interface IAppletIntegration {
  shouldBeIntegrated(applet: AppletDetailsDTO): boolean
  shouldBeDisintegrated(applet: AppletDetailsDTO): boolean
  applyIntegration(applet: AppletDetailsDTO): void
  removeIntegration(applet: AppletDetailsDTO): void
}

class AppletIntegrationsService {
  private integrations: IAppletIntegration[] = []

  constructor(state: RootState, dispatch: AppDispatch) {
    this.integrations.push(new LorisAppletIntegration(state, dispatch))
  }

  public applyIntegrations(applet: AppletDetailsDTO): void {
    this.integrations.forEach(integration => {
      if (integration.shouldBeIntegrated(applet)) {
        integration.applyIntegration(applet)
      } else if (integration.shouldBeDisintegrated(applet)) {
        integration.removeIntegration(applet)
      }
    })
  }
}

export default AppletIntegrationsService
