import { useEffect } from 'react';

import { appletModel } from '~/entities/applet';
import { AppletIntegrationsService } from '~/entities/applet/model/integrations';
import { AppletBaseDTO } from '~/shared/api';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type Props = {
  appletDetails: AppletBaseDTO;
};

export const useIntegrationsSync = ({ appletDetails }: Props) => {
  const dispatch = useAppDispatch();
  const consents = useAppSelector(appletModel.selectors.selectConsents);

  useEffect(() => {
    if (consents) {
      const appletIntegrationService = new AppletIntegrationsService(consents, dispatch);

      appletIntegrationService.applyIntegrations(appletDetails);
    }
  }, [appletDetails, dispatch, consents]);
};
