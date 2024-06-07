import { createContext } from 'react';

type PrivateContext = {
  isPublic: false;

  appletId: string;
  activityId: string;
  eventId: string;
};

type PublicContext = {
  isPublic: true;

  appletId: string;
  activityId: string;
  eventId: string;

  publicAppletKey: string;
};

type Context = PrivateContext | PublicContext;

export const SurveyBasicContext = createContext<Context>({} as Context);
