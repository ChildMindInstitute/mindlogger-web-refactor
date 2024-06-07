import { IAppletIntegration } from './AppletIntegrationsService';
import { actions } from '../slice';

import { ActivityConsents, Consents } from '~/abstract/lib';
import { AppletBaseDTO } from '~/shared/api';
import { AppDispatch } from '~/shared/utils';

class LorisAppletIntegration implements IAppletIntegration {
  private logger: Console;
  private dispatch: AppDispatch;
  private consents: ActivityConsents;

  constructor(consents: ActivityConsents, dispatch: AppDispatch) {
    this.logger = console;
    this.dispatch = dispatch;
    this.consents = consents;
  }

  private getAppletConsents(appletId: string): Consents | null {
    const appletConsents = this.consents[appletId] ?? null;

    return appletConsents;
  }

  public shouldBeIntegrated(applet: AppletBaseDTO): boolean {
    const alreadyIntegrated = !!this.getAppletConsents(applet.id);
    const hasIntegration = applet.integrations?.includes('loris') ?? false;

    return !alreadyIntegrated && hasIntegration;
  }

  public shouldBeDisintegrated(applet: AppletBaseDTO): boolean {
    const alreadyIntegrated = !!this.getAppletConsents(applet.id);
    const hasIntegration = applet.integrations?.includes('loris') ?? false;

    return alreadyIntegrated && !hasIntegration;
  }

  public applyIntegration(applet: AppletBaseDTO) {
    this.dispatch(actions.applyDataSharingSettings({ appletId: applet.id }));
    this.logger.info(
      `[LorisAppletIntegration.applyIntegration] LORIS integration of applet: ${applet.displayName}|${applet.id} completed successfully`,
    );
  }

  public removeIntegration(applet: AppletBaseDTO): void {
    this.dispatch(actions.removeDataSharingSettings({ appletId: applet.id }));
    this.logger.info(
      `[LorisAppletIntegration.applyIntegration] LORIS integration has been removed from applet: ${applet.displayName}|${applet.id}`,
    );
  }
}

export default LorisAppletIntegration;
