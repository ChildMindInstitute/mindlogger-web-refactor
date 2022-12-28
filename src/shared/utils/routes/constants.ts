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
    path: "/useraccount/:userId/token/:temporaryToken",
  },

  // Protected routes
  dashboard: {
    path: "/protected/dashboard",
  },
  profile: {
    path: "/protected/profile",
  },
  settings: {
    path: "/protected/settings",
  },
}
