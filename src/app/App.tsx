import { useEffect } from 'react';

import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';
import { useLDClient } from 'launchdarkly-react-client-sdk';

import Providers from './providers';
import i18nManager from './system/locale/i18n';

import ApplicationRouter from '~/pages';
import { Mixpanel } from '~/shared/utils';
import { FeatureFlags } from '~/shared/utils/featureFlags';

import '~/assets/fonts/Atkinson/atkinson.css';
import '~/assets/fonts/Lato/lato.css';

import './index.css';

const isProduction = import.meta.env.VITE_ENV === 'prod';
const isDev = import.meta.env.VITE_ENV === 'dev';

if (import.meta.env.VITE_DD_CLIENT_TOKEN) {
  datadogLogs.init({
    clientToken: import.meta.env.VITE_DD_CLIENT_TOKEN,
    site: 'datadoghq.com',
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
    service: 'mindlogger-web',
    env: import.meta.env.VITE_ENV,
    version: import.meta.env.VITE_DD_VERSION,
  });
}

if (
  import.meta.env.VITE_DD_APP_ID &&
  import.meta.env.VITE_DD_CLIENT_TOKEN &&
  (isDev || isProduction)
) {
  datadogRum.init({
    applicationId: import.meta.env.VITE_DD_APP_ID,
    clientToken: import.meta.env.VITE_DD_CLIENT_TOKEN,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'datadoghq.com',
    service: 'mindlogger-web',
    env: import.meta.env.VITE_ENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: import.meta.env.VITE_DD_VERSION,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    defaultPrivacyLevel: 'mask',
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: false,
    allowedTracingUrls: (import.meta.env.VITE_DD_TRACING_URLS ?? '')
      .split(',')
      .map((it: string) => it.trim()),
  });
}

const setUp = () => {
  Mixpanel.init();
  void i18nManager.initialize();
};

setUp();

function App() {
  // Retrieves the LD client after initialization to pass it to our singleton
  const ldClient = useLDClient();
  useEffect(() => {
    if (!ldClient) return;
    FeatureFlags.init(ldClient);
  }, [ldClient]);

  return (
    <Providers>
      <ApplicationRouter />
    </Providers>
  );
}

export default App;
