import LorisAppletIntegration from './LorisAppletIntegration';

import { AppletDetailsBaseInfoDTO } from '~/shared/api';
import { AppDispatch, RootState } from '~/shared/utils';

export interface IAppletIntegration {
  shouldBeIntegrated(applet: AppletDetailsBaseInfoDTO): boolean;
  shouldBeDisintegrated(applet: AppletDetailsBaseInfoDTO): boolean;
  applyIntegration(applet: AppletDetailsBaseInfoDTO): void;
  removeIntegration(applet: AppletDetailsBaseInfoDTO): void;
}

class AppletIntegrationsService {
  private integrations: IAppletIntegration[] = [];

  constructor(state: RootState, dispatch: AppDispatch) {
    this.integrations.push(new LorisAppletIntegration(state, dispatch));
  }

  public applyIntegrations(applet: AppletDetailsBaseInfoDTO): void {
    this.integrations.forEach((integration) => {
      if (integration.shouldBeIntegrated(applet)) {
        integration.applyIntegration(applet);
      } else if (integration.shouldBeDisintegrated(applet)) {
        integration.removeIntegration(applet);
      }
    });
  }
}

export default AppletIntegrationsService;
