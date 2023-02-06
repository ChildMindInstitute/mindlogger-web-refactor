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
  invitation: {
    path: "/invite",
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
