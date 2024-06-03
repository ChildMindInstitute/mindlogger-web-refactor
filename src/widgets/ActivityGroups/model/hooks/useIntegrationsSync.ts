import { useEffect } from 'react';

import { AppletIntegrationsService } from '~/entities/applet/model/integrations';
import { AppletDetailsBaseInfoDTO } from '~/shared/api';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type Props = {
  appletDetails: AppletDetailsBaseInfoDTO;
};

export const useIntegrationsSync = ({ appletDetails }: Props) => {
  const dispatch = useAppDispatch();
  const rootState = useAppSelector((state) => state);

  useEffect(() => {
    if (rootState) {
      const appletIntegrationService = new AppletIntegrationsService(rootState, dispatch);

      appletIntegrationService.applyIntegrations(appletDetails);
    }
  }, [appletDetails, dispatch, rootState]);
};
