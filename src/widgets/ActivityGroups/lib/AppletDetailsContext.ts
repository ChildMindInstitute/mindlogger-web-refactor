import { createContext } from 'react';

import { AppletBaseDTO, AppletEventsResponse, MyAssignmentsDTO } from '~/shared/api';

type AppletDetailsContextProps = {
  applet: AppletBaseDTO;
  events: AppletEventsResponse;
  assignments: MyAssignmentsDTO['assignments'];
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
