import { lazy } from 'react';

import i18nManager from './system/locale/i18n';

import { Mixpanel } from '~/shared/utils';

const Providers = lazy(() => import('./providers'));
const ApplicationRouter = lazy(() => import('~/pages'));

import '~/assets/fonts/Atkinson/atkinson.css';

import './index.css';

Mixpanel.init();
i18nManager.initialize();

function App() {
  return (
    <Providers>
      <ApplicationRouter />
    </Providers>
  );
}

export default App;
