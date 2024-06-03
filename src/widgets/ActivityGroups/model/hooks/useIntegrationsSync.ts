import { useEffect } from 'react';

import { appletModel } from '~/entities/applet';
import { AppletIntegrationsService } from '~/entities/applet/model/integrations';
import { AppletDetailsBaseInfoDTO } from '~/shared/api';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type Props = {
  appletDetails: AppletDetailsBaseInfoDTO;
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
