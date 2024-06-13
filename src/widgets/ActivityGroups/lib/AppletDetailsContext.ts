import { createContext } from 'react';

import { AppletBaseDTO, AppletEventsResponse } from '~/shared/api';

type AppletDetailsContextProps = {
  applet: AppletBaseDTO;
  events: AppletEventsResponse;
};

type Public = {
  isPublic: true;
  startActivityOrFlow?: string | null;
  publicAppletKey: string;
};

type Private = {
  isPublic: false;
  startActivityOrFlow?: string | null;
  appletId: string;
};

type Context = AppletDetailsContextProps & (Public | Private);

export const AppletDetailsContext = createContext<Context>({} as Context);
