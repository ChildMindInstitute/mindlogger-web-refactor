import mixpanel, { Dict } from "mixpanel-browser"

const isProduction = import.meta.env.VITE_ENV === "PRODUCTION"
const isStaging = import.meta.env.VITE_ENV === "STAGE"
const shouldEnableMixpanel = isProduction || isStaging

// A project's token is not a secret value.
// In front-end implementation this token will be available to anyone visiting the website.
// More on this topic: https://developer.mixpanel.com/reference/project-token;
const PROJECT_TOKEN = "075d1512e69a60bfcd9f7352b21cc4a2"

export const Mixpanel = {
  init() {
    if (shouldEnableMixpanel) mixpanel.init(PROJECT_TOKEN)
  },
  trackPageView(pageName: string) {
    console.log(`[Web] ${pageName}`)
    if (shouldEnableMixpanel) mixpanel.track_pageview({ page: `[Web] ${pageName}` })
  },
  track(action: string, payload?: Dict) {
    console.log(`[Web] ${action}`, payload)
    if (shouldEnableMixpanel) mixpanel.track(`[Web] ${action}`, payload)
  },
  login(userId: string) {
    console.log("[Web] login", userId)
    if (shouldEnableMixpanel) mixpanel.identify(userId)
  },
  logout() {
    console.log("[Web] logout")
    if (shouldEnableMixpanel) mixpanel.reset()
  },
}
