import { createContext } from 'react';

type PrivateContext = {
  isPublic: false;

  appletId: string;
  activityId: string;
  eventId: string;

  flowId: string | null;
};

type PublicContext = {
  isPublic: true;
  publicAppletKey: string;

  appletId: string;
  activityId: string;
  eventId: string;

  flowId: string | null;
};

type Context = PrivateContext | PublicContext;

export const SurveyBasicContext = createContext<Context>({} as Context);
