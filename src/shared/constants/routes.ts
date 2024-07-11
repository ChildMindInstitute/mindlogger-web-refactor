const ROUTES = {
  // Public routes
  login: {
    path: '/login',
  },
  signup: {
    path: '/signup',
  },
  forgotPassword: {
    path: '/forgotpassword',
  },
  changePassword: {
    path: '/password-recovery',
  },
  invitation: {
    path: '/invitation/:inviteId',
  },
  publicJoin: {
    path: '/public/:joinLinkKey',
    navigateTo: (joinLinkKey: string) => `/public/${joinLinkKey}`,
  },
  privateJoin: {
    path: '/join/:joinLinkKey',
  },
  transferOwnership: {
    path: '/transferOwnership/:appletId',
  },
  publicSurvey: {
    path: '/public/applets/:appletId/activityId/:activityId/event/:eventId/entityType/:entityType/publicAppletKey/:publicAppletKey',
    navigateTo: ({
      appletId,
      activityId,
      entityType,
      eventId,
      flowId,
      publicAppletKey,
    }: {
      appletId: string;
      activityId: string;
      eventId: string;
      entityType: 'regular' | 'flow';
      flowId: string | null;
      publicAppletKey: string;
    }) =>
      `/public/applets/${appletId}/activityId/${activityId}/event/${eventId}/entityType/${entityType}/publicAppletKey/${publicAppletKey}?${
        flowId ? `flowId=${flowId}` : ''
      }`,
  },
  publicAutoCompletion: {
    path: '/public/auto-completion',
    navigateTo: ({
      appletId,
      eventId,
      activityId,
      flowId,
      publicAppletKey,
    }: {
      appletId: string;
      activityId: string;
      eventId: string;
      flowId: string | null;
      publicAppletKey: string | null;
    }) =>
      `${ROUTES.publicAutoCompletion.path}?appletId=${appletId}&eventId=${eventId}&activityId=${activityId}${flowId ? `flowId=${flowId}` : ''}${publicAppletKey ? `publicAppletKey=${publicAppletKey}` : ''}`,
  },

  // Protected routes
  profile: {
    path: '/protected/profile',
  },
  settings: {
    path: '/protected/settings',
  },
  appletList: {
    path: '/protected/applets',
  },
  appletDetails: {
    path: '/protected/applets/:appletId',
    navigateTo: (appletId: string | number) => `/protected/applets/${appletId}`,
  },
  survey: {
    path: '/protected/applets/:appletId/activityId/:activityId/event/:eventId/entityType/:entityType',
    navigateTo: ({
      appletId,
      activityId,
      entityType,
      eventId,
      flowId,
    }: {
      appletId: string;
      activityId: string;
      eventId: string;
      entityType: 'regular' | 'flow';
      flowId: string | null;
    }) =>
      `/protected/applets/${appletId}/activityId/${activityId}/event/${eventId}/entityType/${entityType}?${
        flowId ? `flowId=${flowId}` : ''
      }`,
  },
  invitationAccept: {
    path: '/protected/invite/accepted',
  },
  invitationDecline: {
    path: '/protected/invite/declined',
  },

  autoCompletion: {
    path: '/protected/auto-completion',
    navigateTo: ({
      appletId,
      eventId,
      activityId,
      flowId,
      publicAppletKey,
    }: {
      appletId: string;
      activityId: string;
      eventId: string;
      flowId: string | null;
      publicAppletKey: string | null;
    }) =>
      `${ROUTES.autoCompletion.path}?appletId=${appletId}&eventId=${eventId}&activityId=${activityId}${flowId ? `&flowId=${flowId}` : ''}${publicAppletKey ? `&publicAppletKey=${publicAppletKey}` : ''}`,
  },
};

export default ROUTES;
