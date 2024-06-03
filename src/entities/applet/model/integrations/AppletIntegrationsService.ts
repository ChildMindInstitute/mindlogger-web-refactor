import LorisAppletIntegration from './LorisAppletIntegration';

import { ActivityConsents } from '~/abstract/lib';
import { AppletDetailsBaseInfoDTO } from '~/shared/api';
import { AppDispatch } from '~/shared/utils';

export interface IAppletIntegration {
  shouldBeIntegrated(applet: AppletDetailsBaseInfoDTO): boolean;
  shouldBeDisintegrated(applet: AppletDetailsBaseInfoDTO): boolean;
  applyIntegration(applet: AppletDetailsBaseInfoDTO): void;
  removeIntegration(applet: AppletDetailsBaseInfoDTO): void;
}

class AppletIntegrationsService {
  private integrations: IAppletIntegration[] = [];

  constructor(consents: ActivityConsents, dispatch: AppDispatch) {
    this.integrations.push(new LorisAppletIntegration(consents, dispatch));
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
