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
    path: "/email/:email/password-recovery/:token",
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
}
