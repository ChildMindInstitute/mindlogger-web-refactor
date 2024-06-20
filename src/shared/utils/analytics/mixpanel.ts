import mixpanel, { Dict } from 'mixpanel-browser';

const PROJECT_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

const isProduction = import.meta.env.VITE_ENV === 'prod';
const isStaging = import.meta.env.VITE_ENV === 'stage';
const isUat = import.meta.env.VITE_ENV === 'uat';
const isDev = import.meta.env.VITE_ENV === 'dev';
const isJest = !!import.meta.env.JEST_WORKER_ID;

const shouldEnableMixpanel =
  PROJECT_TOKEN &&
  !isJest &&
  (isProduction || isStaging || isUat || import.meta.env.VITE_MIXPANEL_FORCE_ENABLE === 'true');

export const Mixpanel = {
  init() {
    if (shouldEnableMixpanel) mixpanel.init(PROJECT_TOKEN, { ignore_dnt: isDev });
  },
  trackPageView(pageName: string) {
    if (shouldEnableMixpanel) mixpanel.track_pageview({ page: `[Web] ${pageName}` });
  },
  track(action: string, payload?: Dict) {
    if (shouldEnableMixpanel) mixpanel.track(`[Web] ${action}`, payload);
  },
  login(userId: string) {
    if (shouldEnableMixpanel) {
      mixpanel.identify(userId);
      mixpanel.people.set({
        'User ID': userId,
        'App Build Number': import.meta.env.VITE_BUILD_VERSION,
      });
    }
  },
  logout() {
    if (shouldEnableMixpanel) mixpanel.reset();
  },
};
