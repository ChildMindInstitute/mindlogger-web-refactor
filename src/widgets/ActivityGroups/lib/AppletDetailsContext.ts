import { createContext } from 'react';

import { AppletDetailsBaseInfoDTO, AppletEventsResponse } from '~/shared/api';

type AppletDetailsContextProps = {
  applet: AppletDetailsBaseInfoDTO;
  events: AppletEventsResponse;
};

type PublicAppletDetails = {
  isPublic: true;
  startActivityOrFlow?: string | null;
  publicAppletKey: string;
};

type PrivateAppletDetails = {
  isPublic: false;
  startActivityOrFlow?: string | null;
  appletId: string;
};

type Context = AppletDetailsContextProps & (PublicAppletDetails | PrivateAppletDetails);

export const AppletDetailsContext = createContext<Context>({} as Context);
