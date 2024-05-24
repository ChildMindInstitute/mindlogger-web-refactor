import { IAppletIntegration } from './AppletIntegrationsService';
import { selectConsents } from '../selectors';
import { actions } from '../slice';

import { Consents } from '~/abstract/lib';
import { AppletDetailsBaseInfoDTO } from '~/shared/api';
import { AppDispatch, RootState } from '~/shared/utils';

class LorisAppletIntegration implements IAppletIntegration {
  private logger: Console;
  private dispatch: AppDispatch;
  private state: RootState;

  constructor(state: RootState, dispatch: AppDispatch) {
    this.logger = console;
    this.dispatch = dispatch;
    this.state = state;
  }

  private getAppletConsents(appletId: string): Consents | null {
    const consents = selectConsents(this.state);

    if (!consents) {
      return null;
    }

    const appletConsents = consents[appletId] ?? null;

    return appletConsents;
  }

  public shouldBeIntegrated(applet: AppletDetailsBaseInfoDTO): boolean {
    const alreadyIntegrated = !!this.getAppletConsents(applet.id);
    const hasIntegration = applet.integrations?.includes('loris') ?? false;

    return !alreadyIntegrated && hasIntegration;
  }

  public shouldBeDisintegrated(applet: AppletDetailsBaseInfoDTO): boolean {
    const alreadyIntegrated = !!this.getAppletConsents(applet.id);
    const hasIntegration = applet.integrations?.includes('loris') ?? false;

    return alreadyIntegrated && !hasIntegration;
  }

  public applyIntegration(applet: AppletDetailsBaseInfoDTO) {
    this.dispatch(actions.applyDataSharingSettings({ appletId: applet.id }));
    this.logger.info(
      `[LorisAppletIntegration.applyIntegration] LORIS integration of applet: ${applet.displayName}|${applet.id} completed successfully`,
    );
  }

  public removeIntegration(applet: AppletDetailsBaseInfoDTO): void {
    this.dispatch(actions.removeDataSharingSettings({ appletId: applet.id }));
    this.logger.info(
      `[LorisAppletIntegration.applyIntegration] LORIS integration has been removed from applet: ${applet.displayName}|${applet.id}`,
    );
  }
}

export default LorisAppletIntegration;
