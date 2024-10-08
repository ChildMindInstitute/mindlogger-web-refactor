import { useEffect } from 'react';

import { useLDClient } from 'launchdarkly-react-client-sdk';

import Providers from './providers';
import i18nManager from './system/locale/i18n';

import ApplicationRouter from '~/pages';
import { Mixpanel } from '~/shared/utils';
import { FeatureFlags } from '~/shared/utils/featureFlags';

import '~/assets/fonts/Atkinson/atkinson.css';

import './index.css';

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
