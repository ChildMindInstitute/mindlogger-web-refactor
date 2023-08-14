export const ROUTES = {
  // Public routes
  login: {
    path: "/login",
  },
  signup: {
    path: "/signup",
  },
  forgotPassword: {
    path: "/forgotpassword",
  },
  changePassword: {
    path: "/password-recovery",
  },
  invitation: {
    path: "/invitation/:inviteId",
  },
  publicJoin: {
    path: "/public/:joinLinkKey",
    navigateTo: (joinLinkKey: string) => `/public/${joinLinkKey}`,
  },
  privateJoin: {
    path: "/join/:joinLinkKey",
  },
  transferOwnership: {
    path: "/transferOwnership/:appletId",
  },
  publicActivityDetails: {
    path: "/public/applets/:appletId/entityId/:entityId/event/:eventId/entityType/:entityType/publicAppletKey/:publicAppletKey",
    navigateTo: (
      appletId: string,
      entityId: string,
      eventId: string,
      entityType: "regular" | "flow",
      publicAppletKey: string,
    ) =>
      `/public/applets/${appletId}/entityId/${entityId}/event/${eventId}/entityType/${entityType}/publicAppletKey/${publicAppletKey}`,
  },

  // Protected routes
  profile: {
    path: "/protected/profile",
  },
  settings: {
    path: "/protected/settings",
  },
  applets: {
    path: "/protected/applets",
  },
  activityList: {
    path: "/protected/applets/:appletId",
    navigateTo: (appletId: string | number) => `/protected/applets/${appletId}`,
  },
  activityDetails: {
    path: "/protected/applets/:appletId/entityId/:entityId/event/:eventId/entityType/:entityType",
    navigateTo: (appletId: string, entityId: string, eventId: string, entityType: "regular" | "flow") =>
      `/protected/applets/${appletId}/entityId/${entityId}/event/${eventId}/entityType/${entityType}`,
  },
  invitationAccept: {
    path: "/protected/invite/accepted",
  },
  invitationDecline: {
    path: "/protected/invite/declined",
  },
  thanks: {
    path: "/protected/thanks/:appletId/isPublic/:isPublic",
    navigateTo: (appletId: string, isPublic: boolean) => `/protected/thanks/${appletId}/isPublic/${isPublic}`,
  },
}
