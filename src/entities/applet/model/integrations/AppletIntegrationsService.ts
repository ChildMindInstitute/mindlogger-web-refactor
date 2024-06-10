import LorisAppletIntegration from './LorisAppletIntegration';

import { ActivityConsents } from '~/abstract/lib';
import { AppletBaseDTO } from '~/shared/api';
import { AppDispatch } from '~/shared/utils';

export interface IAppletIntegration {
  shouldBeIntegrated(applet: AppletBaseDTO): boolean;
  shouldBeDisintegrated(applet: AppletBaseDTO): boolean;
  applyIntegration(applet: AppletBaseDTO): void;
  removeIntegration(applet: AppletBaseDTO): void;
}

class AppletIntegrationsService {
  private integrations: IAppletIntegration[] = [];

  constructor(consents: ActivityConsents, dispatch: AppDispatch) {
    this.integrations.push(new LorisAppletIntegration(consents, dispatch));
  }

  public applyIntegrations(applet: AppletBaseDTO): void {
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
