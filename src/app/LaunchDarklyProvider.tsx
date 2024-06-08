import { init as SentryInit, replayIntegration } from '@sentry/react';
import { withLDProvider } from 'launchdarkly-react-client-sdk';

import App from './App';

SentryInit({
  dsn: import.meta.env.VITE_SENTRY_DSN ?? '',
  integrations: [
    // See docs for support of different versions of variation of react router
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    replayIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  tracePropagationTargets: import.meta.env.VITE_SENTRY_TRACE_PROPAGATION_TARGETS
    ? (JSON.parse(import.meta.env.VITE_SENTRY_TRACE_PROPAGATION_TARGETS) as Array<string>)
    : [],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export default withLDProvider({
  clientSideID: import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID,
})(App);
