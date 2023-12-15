import { actions } from "../activity.slice"
import { selectAppletConsents } from "../selectors"
import { IAppletIntegration } from "./AppletIntegrationsService"

import { AppletDetailsDTO } from "~/shared/api"
import { AppDispatch, RootState } from "~/shared/utils"

class LorisAppletIntegration implements IAppletIntegration {
  private logger: Console
  private dispatch: AppDispatch
  private state: RootState

  constructor(state: RootState, dispatch: AppDispatch) {
    this.logger = console
    this.dispatch = dispatch
    this.state = state
  }

  private getAppletConsents(appletId: string) {
    return selectAppletConsents(this.state, appletId)
  }

  public shouldBeIntegrated(applet: AppletDetailsDTO): boolean {
    const alreadyIntegrated = !!this.getAppletConsents(applet.id)
    const hasIntegration = applet.integrations?.includes("loris")

    return !alreadyIntegrated && hasIntegration
  }

  public shouldBeDisintegrated(applet: AppletDetailsDTO): boolean {
    const alreadyIntegrated = !!this.getAppletConsents(applet.id)
    const hasIntegration = applet.integrations?.includes("loris")

    return alreadyIntegrated && !hasIntegration
  }

  public applyIntegration(applet: AppletDetailsDTO) {
    this.dispatch(actions.applyDataSharingSettings({ appletId: applet.id }))
    this.logger.info(
      `[LorisAppletIntegration.applyIntegration] LORIS integration of applet: ${applet.displayName}|${applet.id} completed successfully`,
    )
  }

  public removeIntegration(applet: AppletDetailsDTO): void {
    this.dispatch(actions.removeDataSharingSettings({ appletId: applet.id }))
    this.logger.info(
      `[LorisAppletIntegration.applyIntegration] LORIS integration has been removed from applet: ${applet.displayName}|${applet.id}`,
    )
  }
}

export default LorisAppletIntegration
