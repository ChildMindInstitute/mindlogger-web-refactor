import mixpanel, { Dict } from 'mixpanel-browser';

const PROJECT_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

const isProduction = import.meta.env.VITE_ENV === 'prod';
const isStaging = import.meta.env.VITE_ENV === 'stage';
const shouldEnableMixpanel = PROJECT_TOKEN && (isProduction || isStaging);

export const Mixpanel = {
  init() {
    if (shouldEnableMixpanel) mixpanel.init(PROJECT_TOKEN);
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
      mixpanel.people.set({ 'User ID': userId });
    }
  },
  logout() {
    if (shouldEnableMixpanel) mixpanel.reset();
  },
};
