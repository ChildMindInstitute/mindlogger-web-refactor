import { Theme } from "../constants"

export const ROUTES = {
  // Public routes
  login: {
    hasHeader: true,
    hasFooter: true,
    path: "/login",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  signup: {
    hasHeader: true,
    hasFooter: true,
    path: "/signup",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  forgotPassword: {
    hasHeader: true,
    hasFooter: true,
    path: "/forgotpassword",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  changePassword: {
    hasHeader: true,
    hasFooter: true,
    path: "/password-recovery",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  invitation: {
    hasHeader: true,
    hasFooter: true,
    path: "/invitation/:inviteId",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  publicJoin: {
    hasHeader: true,
    hasFooter: true,
    path: "/public/:joinLinkKey",
    navigateTo: (joinLinkKey: string) => `/public/${joinLinkKey}`,
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  privateJoin: {
    hasHeader: true,
    hasFooter: true,
    path: "/join/:joinLinkKey",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  transferOwnership: {
    hasHeader: true,
    hasFooter: true,
    path: "/transferOwnership/:appletId",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  publicActivityDetails: {
    hasHeader: true,
    hasFooter: true,
    path: "/public/applets/:appletId/activity/:activityId/event/:eventId/publicAppletKey/:publicAppletKey",
    navigateTo: (appletId: string, activityId: string, eventId: string, publicAppletKey: string) =>
      `/public/applets/${appletId}/activity/${activityId}/event/${eventId}/publicAppletKey/${publicAppletKey}`,
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },

  // Protected routes
  profile: {
    hasHeader: true,
    hasFooter: true,
    path: "/protected/profile",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  settings: {
    hasHeader: true,
    hasFooter: true,
    path: "/protected/settings",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  applets: {
    hasHeader: true,
    hasFooter: true,
    path: "/protected/applets",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  activityList: {
    hasHeader: true,
    hasFooter: true,
    path: "/protected/applets/:appletId",
    navigateTo: (appletId: string | number) => `/protected/applets/${appletId}`,
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  activityDetails: {
    hasHeader: false,
    hasFooter: false,
    path: "/protected/applets/:appletId/activity/:activityId/event/:eventId",
    navigateTo: (appletId: string, activityId: string, eventId: string) =>
      `/protected/applets/${appletId}/activity/${activityId}/event/${eventId}`,
    pageStyles: {
      backgroundColor: Theme.colors.light.surface,
    },
  },
  invitationAccept: {
    hasHeader: true,
    hasFooter: true,
    path: "/protected/invite/accepted",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  invitationDecline: {
    hasHeader: true,
    hasFooter: true,
    path: "/protected/invite/declined",
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
  thanks: {
    hasHeader: true,
    hasFooter: true,
    path: "/protected/thanks/:appletId/isPublic/:isPublic",
    navigateTo: (appletId: string, isPublic: boolean) => `/protected/thanks/${appletId}/isPublic/${isPublic}`,
    pageStyles: {
      backgroundColor: Theme.colors.light.surface1,
    },
  },
}
